// Corpus access for the compiler harness: the truth (for keys), the rendered items' trap tags, the
// corpus items as published (Markdown files parsed to JSON form), patient splits and sample selection.

import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseMarkdown } from "../../core/src/markdown.ts";
import { build } from "../../render/src/corpus.ts";
import type { RenderedItem } from "../../render/src/context.ts";
import type { Patient, SourceKey } from "../../truth/src/model.ts";
import { findRepoRoot } from "../../agent-runner/src/index.ts";
import { factTraps, SOURCE_KEY, type TrapIndex } from "./keys.ts";

export const REPO = findRepoRoot(import.meta.dir);
export const CORPUS = join(REPO, "corpus");
export const SOURCES = ["northgate", "lakeview", "riverside", "homelog"] as const;
export type Source = (typeof SOURCES)[number];
export const EVAL_AS_OF = "2026-10-13";

export const SCHEMA_FILE: Record<Source, string> = {
  northgate: "sources/northgate/schema/northgate-chart-v1.d.ts",
  lakeview: "sources/lakeview/schema/lakeview-v1.d.ts",
  riverside: "sources/riverside/schema/riverside-doc-v1.d.ts",
  homelog: "sources/homelog/schema/homelog-v1.d.ts",
};

export function schemaText(s: Source): string { return readFileSync(join(REPO, SCHEMA_FILE[s]), "utf8"); }
export function schemaHash(s: Source): string { return createHash("sha256").update(readFileSync(join(REPO, SCHEMA_FILE[s]))).digest("hex"); }

export interface FolioItem { id: string; issuer: string; patient: string; effective: string; recorded: string; narrative: string; payload: Record<string, any>; supersedes?: string[]; retracts?: string[]; [k: string]: unknown }

// ─── Truth ─────────────────────────────────────────────────────────────────────────────────────────

let built: { patients: Patient[]; items: Map<string, RenderedItem[]> } | undefined;
const ixCache = new Map<string, TrapIndex>();

export function truth() {
  built ??= build();
  return built;
}
export function patientById(id: string): Patient {
  const p = truth().patients.find((x) => x.id === id);
  if (!p) throw new Error(`no patient ${id}`);
  return p;
}
export function trapIndex(p: Patient): TrapIndex {
  let ix = ixCache.get(p.id);
  if (ix) return ix;
  const item = new Map<string, Set<string>>();
  for (const it of truth().items.get(p.id)!) for (const f of it.facts) {
    const k = `${it.source}|${f}`;
    if (!item.has(k)) item.set(k, new Set());
    for (const t of it.traps) item.get(k)!.add(t);
  }
  ix = { fact: factTraps(p), item };
  ixCache.set(p.id, ix);
  return ix;
}

// ─── Patients, splits ──────────────────────────────────────────────────────────────────────────────

export interface PatientRef { patient: string; role: string; sources: Partial<Record<Source, string>> }
export function patients(): PatientRef[] {
  return JSON.parse(readFileSync(join(CORPUS, "answers/patients.json"), "utf8"));
}

/**
 * Split by truth patient id, the same in every source: train (samples shown to the compiler agent),
 * dev (feedback for conditions b and c), test (held out; all reported scores). The hero and the
 * secondaries are always test.
 */
export type Split = "train" | "dev" | "test";
export function splitOf(patient: string): Split {
  if (patient === "hero" || /^s\d+$/.test(patient)) return "test";
  const b = createHash("sha256").update(`folio-stage3/${patient}`).digest()[0] % 10;
  return b < 2 ? "train" : b < 4 ? "dev" : "test";
}
export function patientsIn(source: Source, split: Split): PatientRef[] {
  return patients().filter((p) => p.sources[source] && splitOf(p.patient) === split);
}

// ─── Items ─────────────────────────────────────────────────────────────────────────────────────────

export interface LoadedItem { file: string; markdown: string; item: FolioItem }

export function loadItems(source: Source, localId: string): LoadedItem[] {
  const dir = join(CORPUS, source, localId);
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith(".folio.md")).sort().map((f) => {
    const markdown = readFileSync(join(dir, f), "utf8");
    return { file: f, markdown, item: parseMarkdown(markdown) as unknown as FolioItem };
  });
}

/** Deterministic shuffle (the contract says items arrive in no particular order). */
export function shuffled<T>(xs: T[], seed: string): T[] {
  const keyed = xs.map((x, i) => ({ x, k: createHash("sha256").update(`${seed}/${i}`).digest("hex") }));
  return keyed.sort((a, b) => a.k.localeCompare(b.k)).map((e) => e.x);
}

export function itemsForPatient(source: Source, p: PatientRef): FolioItem[] {
  const local = p.sources[source];
  if (!local) return [];
  return shuffled(loadItems(source, local).map((l) => l.item), `${source}/${p.patient}`);
}

// ─── Samples for the compiler agent ────────────────────────────────────────────────────────────────

function features(it: FolioItem): string[] {
  const f = new Set<string>(Object.values(it.payload ?? {}).map((e: any) => `type:${e?.type}`));
  if (it.supersedes?.length) f.add("supersedes");
  if (it.retracts?.length) f.add("retracts");
  if (it.narrative && /<ref id=/.test(it.narrative)) f.add("narrative-with-refs");
  return [...f];
}

/**
 * About eight items from training patients that together show every entry type the training corpus
 * has, plus a superseding item and a retraction when the source publishes them. Greedy: each pick adds
 * the most unseen features; ties go to items of patients already picked (a coherent story), then
 * to the earliest file. Deterministic.
 */
export function selectSamples(source: Source, min = 8): { patient: string; file: string; markdown: string; item: FolioItem }[] {
  const train = patientsIn(source, "train");
  const pool = train.flatMap((p) => loadItems(source, p.sources[source]!).map((l) => ({ patient: p.patient, ...l })));
  const all = new Set(pool.flatMap((x) => features(x.item)));
  const covered = new Set<string>();
  const picked: typeof pool = [];
  const patientsPicked = new Set<string>();
  while (picked.length < 14 && (picked.length < min || [...all].some((f) => !covered.has(f)))) {
    let best: (typeof pool)[number] | undefined, bestScore = -1;
    for (const x of pool) {
      if (picked.includes(x)) continue;
      const gain = features(x.item).filter((f) => !covered.has(f)).length;
      const score = gain * 1000 + (patientsPicked.has(x.patient) ? 100 : 0) + (x.item.narrative ? 10 : 0);
      if (score > bestScore) { best = x; bestScore = score; }
    }
    if (!best) break;
    picked.push(best);
    patientsPicked.add(best.patient);
    for (const f of features(best.item)) covered.add(f);
  }
  // Show what a superseding item replaces: add the original next to it.
  for (const x of [...picked]) for (const id of x.item.supersedes ?? []) {
    const orig = pool.find((y) => y.item.id === id && y.patient === x.patient);
    if (orig && !picked.includes(orig)) picked.splice(picked.indexOf(x), 0, orig);
  }
  return picked;
}

export const sourceKey = (s: Source): SourceKey => SOURCE_KEY[s];
