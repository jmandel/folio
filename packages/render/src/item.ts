// Record items (spec/record-item.md): the envelope + narrative + payload, Markdown serialization,
// deterministic ULIDs, and schema references with real hashes.

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

export const REPO = resolve(import.meta.dir, "../../..");

export interface Author { id: string; name: string; role: string }
export interface SchemaRef { url: string; type: string; sha256: string }

export interface Item {
  folio: "0.1";
  id: string;
  issuer: string;
  patient: string;
  effective: string;
  effective_end?: string;
  recorded: string;
  author?: Author;
  schema?: SchemaRef;
  supersedes?: string[];
  retracts?: string[];
  narrative: string;
  payload: Record<string, Record<string, unknown>>;
}

export type SourceDir = "riverside" | "northgate" | "lakeview" | "homelog";

const SCHEMAS: Record<SourceDir, { file: string; url: string }> = {
  riverside: { file: "riverside-doc-v1.d.ts", url: "https://riverside-regional.example/folio/schemas/riverside-doc-v1.d.ts" },
  northgate: { file: "northgate-chart-v1.d.ts", url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts" },
  lakeview: { file: "lakeview-v1.d.ts", url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts" },
  homelog: { file: "homelog-v1.d.ts", url: "https://homelog.example/folio/schemas/homelog-v1.d.ts" },
};

export function schemaPath(src: SourceDir): string {
  return join(REPO, "sources", src, "schema", SCHEMAS[src].file);
}

const hashCache = new Map<string, string>();
export function schemaRef(src: SourceDir, type: string): SchemaRef {
  const path = schemaPath(src);
  let sha = hashCache.get(path);
  if (!sha) {
    sha = createHash("sha256").update(readFileSync(path)).digest("hex");
    hashCache.set(path, sha);
  }
  return { url: SCHEMAS[src].url, type, sha256: sha };
}

// ─── ULIDs ──────────────────────────────────────────────────────────────────────────────────────

const B32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/** Deterministic ULID: time part from `recorded`, random part from a hash of `seed`. */
export function ulid(recorded: string, seed: string): string {
  let t = Date.parse(recorded);
  if (Number.isNaN(t)) throw new Error(`ulid: bad time ${recorded}`);
  let time = "";
  for (let i = 0; i < 10; i++) {
    time = B32[t % 32] + time;
    t = Math.floor(t / 32);
  }
  const h = createHash("sha256").update(seed).digest();
  let rand = "";
  for (let i = 0; i < 16; i++) rand += B32[h[i] % 32];
  return time + rand;
}

// ─── Markdown form ──────────────────────────────────────────────────────────────────────────────

const q = (s: string) => JSON.stringify(s);

export function toMarkdown(it: Item): string {
  const lines = ["---", `folio: ${q(it.folio)}`, `id: ${q(it.id)}`, `issuer: ${q(it.issuer)}`, `patient: ${q(it.patient)}`,
    `effective: ${q(it.effective)}`];
  if (it.effective_end) lines.push(`effective_end: ${q(it.effective_end)}`);
  lines.push(`recorded: ${q(it.recorded)}`);
  if (it.author) lines.push("author:", `  id: ${q(it.author.id)}`, `  name: ${q(it.author.name)}`, `  role: ${q(it.author.role)}`);
  if (it.schema) lines.push("schema:", `  url: ${q(it.schema.url)}`, `  type: ${q(it.schema.type)}`, `  sha256: ${q(it.schema.sha256)}`);
  if (it.supersedes?.length) lines.push("supersedes:", ...it.supersedes.map((s) => `  - ${q(s)}`));
  if (it.retracts?.length) lines.push("retracts:", ...it.retracts.map((s) => `  - ${q(s)}`));
  lines.push("---");
  let out = lines.join("\n") + "\n";
  const narrative = it.narrative.trim();
  if (narrative) out += narrative + "\n";
  if (Object.keys(it.payload).length) out += "\n```json payload\n" + formatPayload(it.payload) + "\n```\n";
  return out;
}

/** JSON with each top-level entry expanded and small nested values kept on one line, like the examples. */
export function formatPayload(payload: Record<string, unknown>): string {
  const inline = (v: unknown): string => {
    if (Array.isArray(v)) return v.length ? `[${v.map(inline).join(", ")}]` : "[]";
    if (v && typeof v === "object") {
      const e = Object.entries(v as Record<string, unknown>).filter(([, x]) => x !== undefined);
      return e.length ? `{ ${e.map(([k, x]) => `${q(k)}: ${inline(x)}`).join(", ")} }` : "{}";
    }
    return JSON.stringify(v);
  };
  const block = (v: unknown, indent: string): string => {
    const one = inline(v);
    if (indent.length > 2 && one.length + indent.length <= 140) return one;
    if (Array.isArray(v)) {
      if (!v.length) return "[]";
      return `[\n${v.map((x) => indent + "  " + block(x, indent + "  ")).join(",\n")}\n${indent}]`;
    }
    if (v && typeof v === "object") {
      const e = Object.entries(v as Record<string, unknown>).filter(([, x]) => x !== undefined);
      if (!e.length) return "{}";
      return `{\n${e.map(([k, x]) => `${indent}  ${q(k)}: ${block(x, indent + "  ")}`).join(",\n")}\n${indent}}`;
    }
    return JSON.stringify(v);
  };
  return block(payload, "");
}

/** Parse a .folio.md file (enough for our own output and the examples). */
export function parseItem(text: string): { front: Record<string, unknown>; narrative: string; payload: Record<string, any>; fenceOk: boolean } {
  const fm = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fm) throw new Error("no frontmatter");
  const front: Record<string, unknown> = {};
  let parent: string | null = null;
  for (const line of fm[1].split("\n")) {
    let m: RegExpMatchArray | null;
    if ((m = line.match(/^([a-z_]+):\s*(.*)$/))) {
      parent = m[1];
      front[m[1]] = m[2] === "" ? undefined : JSON.parse(m[2]);
    } else if ((m = line.match(/^ {2}([a-z_0-9]+):\s*(.*)$/)) && parent) {
      const o = (front[parent] ??= {}) as Record<string, unknown>;
      o[m[1]] = JSON.parse(m[2]);
    } else if ((m = line.match(/^ {2}- (.*)$/)) && parent) {
      const a = Array.isArray(front[parent]) ? (front[parent] as unknown[]) : (front[parent] = []) as unknown[];
      a.push(JSON.parse(m[1]));
    }
  }
  const body = fm[2];
  const fence = body.match(/(`{3,})json payload\n([\s\S]*?)\n\1\s*$/);
  const narrative = (fence ? body.slice(0, fence.index) : body).trim();
  return { front, narrative, payload: fence ? JSON.parse(fence[2]) : {}, fenceOk: !!fence || !body.includes("json payload") };
}
