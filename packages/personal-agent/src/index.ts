// Personal Agent: syncs one patient's items from several FOLIO nodes, verifies every signature,
// keeps a local log (files + an index), prints a merged timeline, and makes and checks
// selective-disclosure presentations.
//
// Store layout:
//   <store>/index.json                         cursors per source + one row per item
//   <store>/items/<did-host>/<item id>.sd-jwt   the signed item as received (all disclosures)
//   <store>/items/<did-host>/<item id>.folio.md readable copy (canonical Markdown form)
//   <store>/schemas/<sha256>.d.ts              schema files, checked against their hash
//   <store>/dids/<did-host>.json               DID documents seen while verifying

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  createDidWebResolver, defaultView, didWebHost, extractRefs, itemKey, jsonEqual, listUnits, mapUrl,
  presentWithholding, present, renderVerified, toMarkdown, verify,
  type DidDocument, type Envelope, type FetchLike, type Resolver, type UnitInfo, type VerifiedItem,
} from "@folio/core";
import { pullPages, type Fetch } from "@folio/sync";

export interface SourceConfig {
  /** Short display name. */
  name: string;
  /** Issuer DID; the node is found at its did:web host (through `hostMap` in development). */
  issuer: string;
  /** The patient's id at this issuer. */
  patient: string;
  /** Optional explicit base URL of the node; default: the DID's host, mapped through hostMap. */
  url?: string;
}

export interface AgentConfig {
  label?: string;
  sources: SourceConfig[];
  /** DID host → local base URL, for development nodes on localhost. */
  hostMap?: Record<string, string>;
}

export interface IndexRow extends Pick<Envelope, "issuer" | "id" | "patient" | "effective" | "recorded"> {
  source: string;
  effective_end?: string;
  supersedes?: string[];
  retracts?: string[];
  schemaType?: string;
  schemaSha256?: string;
  author?: string;
  summary: string;
  file: string;
}

export interface StoreIndex {
  version: 1;
  sources: Record<string, { name: string; patient: string; cursor?: string; lastSync?: string }>;
  items: IndexRow[];
}

export interface SyncReport {
  source: string;
  received: number;
  added: number;
  duplicates: number;
  rejected: { reason: string }[];
  schemasFetched: number;
  schemaProblems: string[];
}

const emptyIndex = (): StoreIndex => ({ version: 1, sources: {}, items: [] });

export function loadIndex(store: string): StoreIndex {
  const p = join(store, "index.json");
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : emptyIndex();
}

function saveIndex(store: string, index: StoreIndex) {
  mkdirSync(store, { recursive: true });
  writeFileSync(join(store, "index.json"), JSON.stringify(index, null, 2) + "\n");
}

function nodeUrl(src: SourceConfig, hostMap: Record<string, string> = {}): string {
  return src.url ?? mapUrl(`https://${didWebHost(src.issuer)}/`, hostMap).replace(/\/$/, "");
}

/** A did:web resolver that records the documents it fetches into the store. */
function storeResolver(store: string, hostMap: Record<string, string> | undefined, offline: boolean, fetchFn?: FetchLike): Resolver {
  const documents: Record<string, DidDocument> = {};
  if (offline) {
    const dir = join(store, "dids");
    if (existsSync(dir))
      for (const f of readdirSync(dir)) {
        const d = JSON.parse(readFileSync(join(dir, f), "utf8")) as DidDocument;
        documents[d.id] = d;
      }
  }
  const base = fetchFn ?? ((u: string) => fetch(u));
  const recording: FetchLike = async (u) => {
    if (offline) throw new Error(`offline: no cached DID document for ${u}`);
    const res = await base(u);
    if (!res.ok) return res;
    const doc = (await res.json()) as DidDocument;
    if (doc?.id?.startsWith("did:web:")) {
      mkdirSync(join(store, "dids"), { recursive: true });
      writeFileSync(join(store, "dids", `${didWebHost(doc.id).replace(/[:/]/g, "_")}.json`), JSON.stringify(doc, null, 2) + "\n");
    }
    return { ok: true, status: 200, json: async () => doc };
  };
  return createDidWebResolver({ hostMap, documents, fetch: recording });
}

function summarize(v: VerifiedItem): string {
  const plain = extractRefs(v.item?.narrative ?? "").plain;
  const line = plain
    .split(/\n[ \t]*\n/)
    .map((para) => para.replace(/^#+\s*/gm, "").replace(/\*\*/g, "").replace(/\s+/g, " ").trim())
    .find((l) => l.length > 0);
  if (line) return line.length > 90 ? line.slice(0, 89) + "…" : line;
  const counts = new Map<string, number>();
  for (const e of Object.values(v.payload)) {
    const t = String((e as any)?.type ?? "?");
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts].map(([t, n]) => (n > 1 ? `${t} ×${n}` : t)).join(", ");
}

/** Syncs every configured source into the store. Safe to repeat: it resumes from saved cursors. */
export async function syncAll(config: AgentConfig, store: string, opts: { fetch?: Fetch; limit?: number; log?: (m: string) => void } = {}): Promise<SyncReport[]> {
  const index = loadIndex(store);
  const have = new Map(index.items.map((r) => [itemKey(r), r]));
  const resolver = storeResolver(store, config.hostMap, false, opts.fetch as FetchLike | undefined);
  const doFetch = opts.fetch ?? ((u: string) => fetch(u));
  const reports: SyncReport[] = [];
  for (const src of config.sources) {
    const rep: SyncReport = { source: src.name, received: 0, added: 0, duplicates: 0, rejected: [], schemasFetched: 0, schemaProblems: [] };
    const state = (index.sources[src.issuer] ??= { name: src.name, patient: src.patient });
    if (state.patient !== src.patient) {
      // A different patient at this issuer: start that feed from the beginning.
      state.patient = src.patient;
      state.cursor = undefined;
    }
    const host = didWebHost(src.issuer);
    for await (const page of pullPages({ baseUrl: nodeUrl(src, config.hostMap), patient: src.patient, since: state.cursor, limit: opts.limit, fetch: doFetch })) {
      for (const sdJwt of page.items) {
        rep.received++;
        let v: VerifiedItem;
        try {
          v = await verify(sdJwt, resolver, { expectedIssuer: src.issuer });
        } catch (e) {
          rep.rejected.push({ reason: (e as Error).message });
          continue;
        }
        if (!v.complete || !v.item) { rep.rejected.push({ reason: `item ${v.envelope.id} arrived with parts withheld` }); continue; }
        if (v.envelope.patient !== src.patient) { rep.rejected.push({ reason: `item ${v.envelope.id} is for patient ${v.envelope.patient}` }); continue; }
        const key = itemKey(v.envelope);
        const dir = join(store, "items", host);
        const file = join("items", host, `${v.envelope.id}.sd-jwt`);
        if (have.has(key)) {
          rep.duplicates++;
          const prior = await verify(readFileSync(join(store, have.get(key)!.file), "utf8"), resolver);
          if (!jsonEqual(prior.item, v.item)) opts.log?.(`${src.name}: WARNING item ${v.envelope.id} re-published with different content; keeping the first copy`);
          continue;
        }
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(store, file), sdJwt);
        writeFileSync(join(dir, `${v.envelope.id}.folio.md`), toMarkdown(v.item));
        const e = v.envelope;
        const row: IndexRow = {
          source: src.name, issuer: e.issuer, id: e.id, patient: e.patient, effective: e.effective,
          ...(e.effective_end ? { effective_end: e.effective_end } : {}),
          recorded: e.recorded,
          ...(e.supersedes?.length ? { supersedes: e.supersedes } : {}),
          ...(e.retracts?.length ? { retracts: e.retracts } : {}),
          ...(e.schema ? { schemaType: e.schema.type, schemaSha256: e.schema.sha256 } : {}),
          ...(e.author?.name ? { author: e.author.name } : {}),
          summary: summarize(v),
          file,
        };
        index.items.push(row);
        have.set(key, row);
        rep.added++;
        if (e.schema) {
          const problem = await fetchSchema(store, e.schema, config.hostMap, doFetch);
          if (problem === "fetched") rep.schemasFetched++;
          else if (problem) rep.schemaProblems.push(problem);
        }
      }
      state.cursor = page.next;
      state.lastSync = new Date().toISOString();
      saveIndex(store, index); // persist progress page by page
    }
    reports.push(rep);
    opts.log?.(
      `${src.name.padEnd(10)} received ${rep.received}, added ${rep.added}, duplicates ${rep.duplicates}, rejected ${rep.rejected.length}` +
        (rep.schemasFetched ? `, schemas fetched ${rep.schemasFetched}` : "") +
        (rep.schemaProblems.length ? `, SCHEMA PROBLEMS: ${rep.schemaProblems.join("; ")}` : ""),
    );
    for (const r of rep.rejected) opts.log?.(`  rejected: ${r.reason}`);
  }
  saveIndex(store, index);
  return reports;
}

/** Fetches a schema by URL unless the store has it; checks the SHA-256. */
async function fetchSchema(store: string, schema: { url: string; sha256: string }, hostMap: Record<string, string> | undefined, doFetch: Fetch): Promise<string | "fetched" | null> {
  const path = join(store, "schemas", `${schema.sha256}.d.ts`);
  if (existsSync(path)) return null;
  try {
    const res = await doFetch(mapUrl(schema.url, hostMap));
    if (!res.ok) return `${schema.url}: HTTP ${res.status}`;
    const bytes = new Uint8Array(await res.arrayBuffer());
    const sha = createHash("sha256").update(bytes).digest("hex");
    if (sha !== schema.sha256) return `${schema.url}: sha256 ${sha} does not match ${schema.sha256}`;
    mkdirSync(join(store, "schemas"), { recursive: true });
    writeFileSync(path, bytes);
    return "fetched";
  } catch (e) {
    return `${schema.url}: ${(e as Error).message}`;
  }
}

/** Sort key: date-times as UTC instants, dates (possibly partial) as written. */
function sortKey(t: string): string {
  return t.includes("T") ? new Date(t).toISOString() : t;
}

export interface TimelineOptions {
  /** Include superseded and retracted items (marked). */
  history?: boolean;
}

/** The merged timeline across sources: default view per issuer, ordered by clinical time. */
export function timeline(store: string, opts: TimelineOptions = {}): string[] {
  const index = loadIndex(store);
  const view = defaultView(index.items);
  const current = new Set(view.current.map(itemKey));
  const rows = (opts.history ? index.items : view.current).slice();
  rows.sort((a, b) => (sortKey(a.effective) < sortKey(b.effective) ? -1 : sortKey(a.effective) > sortKey(b.effective) ? 1 : a.id < b.id ? -1 : 1));
  const width = Math.max(...index.items.map((r) => r.source.length), 6);
  const lines = rows.map((r) => {
    const k = itemKey(r);
    const tags: string[] = [];
    if (!current.has(k)) tags.push(view.retracted.has(k) ? "[RETRACTED]" : "[SUPERSEDED]");
    if (r.supersedes?.length) tags.push(`(supersedes ${r.supersedes.length})`);
    if (r.retracts?.length) tags.push(`(retracts ${r.retracts.length})`);
    return `${r.effective.padEnd(25)} ${r.source.padEnd(width)} ${r.id}  ${(r.schemaType ?? "-").padEnd(12)} ${tags.join(" ")}${tags.length ? " " : ""}${r.summary}`;
  });
  const hidden = index.items.length - view.current.length;
  lines.push(`${view.current.length} item(s) in the default view from ${new Set(index.items.map((r) => r.issuer)).size} source(s); ${hidden} superseded or retracted${opts.history ? " (shown, marked)" : " (use --history)"}.`);
  for (const c of view.conflicts) lines.push(`CONFLICT: ${c.item} is superseded by more than one current item: ${c.by.join(", ")}`);
  return lines;
}

/** Finds an item in the store by id (or unique id prefix). */
export function findItem(store: string, idOrPrefix: string): IndexRow {
  const index = loadIndex(store);
  const hits = index.items.filter((r) => r.id === idOrPrefix || r.id.startsWith(idOrPrefix));
  if (hits.length !== 1) throw new Error(hits.length ? `ambiguous item id ${idOrPrefix}` : `no item ${idOrPrefix} in store`);
  return hits[0];
}

export function readSigned(store: string, row: IndexRow): string {
  return readFileSync(join(store, row.file), "utf8");
}

export interface PresentChoice {
  /** Disclose only these units. */
  disclose?: string[];
  /** Disclose everything except these units. */
  withhold?: string[];
  /** Also withhold every unit whose span text or entry JSON matches this pattern (case-insensitive). */
  withholdMatching?: string;
}

/** Units a presenter can choose from, and the ones a pattern would withhold. */
export async function unitsMatching(signed: string, pattern: string): Promise<UnitInfo[]> {
  const re = new RegExp(pattern, "i");
  return (await listUnits(signed)).filter((u) => re.test(u.spanTexts.join(" ")) || re.test(JSON.stringify(u.entry ?? null)));
}

export async function makePresentation(signed: string, choice: PresentChoice): Promise<{ presentation: string; withheld: string[] }> {
  const all = (await listUnits(signed)).map((u) => u.id);
  let withhold = new Set(choice.withhold ?? []);
  if (choice.disclose) withhold = new Set(all.filter((id) => !choice.disclose!.includes(id)));
  if (choice.withholdMatching) for (const u of await unitsMatching(signed, choice.withholdMatching)) withhold.add(u.id);
  const presentation = choice.disclose && !choice.withholdMatching
    ? await present(signed, choice.disclose)
    : await presentWithholding(signed, withhold);
  return { presentation, withheld: [...withhold] };
}

export async function verifyPresentation(presentation: string, opts: { hostMap?: Record<string, string>; store?: string; offline?: boolean; fetch?: FetchLike } = {}): Promise<VerifiedItem> {
  const resolver = opts.store
    ? storeResolver(opts.store, opts.hostMap, !!opts.offline, opts.fetch)
    : createDidWebResolver({ hostMap: opts.hostMap, fetch: opts.fetch });
  return verify(presentation.trim(), resolver);
}

export { renderVerified };
