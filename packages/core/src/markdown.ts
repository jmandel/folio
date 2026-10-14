// Markdown form (`.folio.md`) and JSON form (`.folio.json`), spec/record-item.md#serializations.
//
// The spec requires md → item → md to yield the same *item*. Hand-written files also format their
// payload JSON for reading (short rows on one line), which no single formatter reproduces, so the
// parser remembers the exact frontmatter and payload text it read (in a WeakMap keyed by the
// returned item) and the serializer reuses that text when it still describes the item's content.
// Items built in code, or edited after parsing, get the canonical layout: the frontmatter style of
// the examples and `JSON.stringify(payload, null, 2)`.

import { parse as parseYaml } from "yaml";
import { ENVELOPE_ORDER, envelopeOf, jsonEqual, makeItem, type Item, type Payload } from "./item.ts";

interface SourceText {
  yaml: string;
  payload?: string;
}
const sourceText = new WeakMap<object, SourceText>();

export class FolioParseError extends Error {}

const FENCE_RE = /^(`{3,})json payload[ \t]*$/;

/** Parses a `.folio.md` file. Structural checks beyond the layout are left to `validateItem`. */
export function parseMarkdown(text: string): Item {
  const src = text.replace(/\r\n/g, "\n");
  if (!src.startsWith("---\n")) throw new FolioParseError("missing frontmatter: file must start with '---'");
  const fmEnd = src.indexOf("\n---\n", 3);
  const fmEndAtEof = fmEnd === -1 && src.endsWith("\n---") ? src.length - 4 : -1;
  const end = fmEnd !== -1 ? fmEnd : fmEndAtEof;
  if (end === -1) throw new FolioParseError("frontmatter is not closed with '---'");
  const yaml = src.slice(4, end + 1);
  const body = src.slice(end + 5);

  let envelope: unknown;
  try {
    envelope = parseYaml(yaml, { schema: "core", uniqueKeys: true });
  } catch (e) {
    throw new FolioParseError(`frontmatter is not valid YAML: ${(e as Error).message}`);
  }
  if (!envelope || typeof envelope !== "object" || Array.isArray(envelope))
    throw new FolioParseError("frontmatter must be a YAML mapping");
  for (const k of ["narrative", "payload"])
    if (k in (envelope as object)) throw new FolioParseError(`'${k}' is not an envelope field`);

  // The payload fence is the last thing in the file; find its opening line.
  const lines = body.split("\n");
  let last = lines.length - 1;
  while (last >= 0 && lines[last].trim() === "") last--;
  let narrative: string;
  let payload: Payload = {};
  let payloadText: string | undefined;
  const fenceOpenIdx = lines.findIndex((l) => FENCE_RE.test(l));
  if (fenceOpenIdx !== -1) {
    const fence = lines[fenceOpenIdx].match(FENCE_RE)![1];
    if (lines[last] !== fence)
      throw new FolioParseError("the 'json payload' fence must be the last thing in the file, closed by the same fence");
    if (lines.slice(fenceOpenIdx + 1, last).some((l) => FENCE_RE.test(l)))
      throw new FolioParseError("more than one 'json payload' fence");
    payloadText = lines.slice(fenceOpenIdx + 1, last).join("\n");
    try {
      payload = JSON.parse(payloadText);
    } catch (e) {
      throw new FolioParseError(`payload is not valid JSON: ${(e as Error).message}`);
    }
    if (!payload || typeof payload !== "object" || Array.isArray(payload))
      throw new FolioParseError("payload must be a JSON object");
    narrative = lines.slice(0, fenceOpenIdx).join("\n");
  } else {
    narrative = body;
  }
  narrative = trimBlankLines(narrative);
  const item = makeItem(envelope as Record<string, unknown>, narrative, payload);
  sourceText.set(item, { yaml, payload: payloadText });
  return item;
}

/** Removes leading and trailing blank lines (not other leading whitespace on the first text line). */
function trimBlankLines(s: string): string {
  if (s.trim() === "") return "";
  return s.replace(/^(?:[ \t]*\n)+/, "").replace(/(?:\n[ \t]*)+$/, "");
}

/** Serializes an item to the Markdown form. */
export function toMarkdown(item: Item): string {
  const hint = sourceText.get(item);
  const env = envelopeOf(item);
  let yaml = emitYaml(orderEnvelope(env));
  if (hint) {
    try {
      if (jsonEqual(parseYaml(hint.yaml, { schema: "core" }), env)) yaml = hint.yaml;
    } catch {
      /* fall back to canonical */
    }
  }
  let out = `---\n${yaml}---\n`;
  const hasPayload = Object.keys(item.payload ?? {}).length > 0;
  if (item.narrative) out += item.narrative + "\n";
  if (hasPayload) {
    let json = JSON.stringify(item.payload, null, 2);
    if (hint?.payload !== undefined && jsonEqual(JSON.parse(hint.payload), item.payload)) json = hint.payload;
    const longestRun = Math.max(0, ...[...json.matchAll(/`+/g)].map((m) => m[0].length));
    const fence = "`".repeat(Math.max(3, longestRun + 1));
    out += `\n${fence}json payload\n${json}\n${fence}\n`;
  }
  return out;
}

/** Parses the JSON form. */
export function parseJson(text: string): Item {
  const v = JSON.parse(text);
  if (!v || typeof v !== "object" || Array.isArray(v)) throw new FolioParseError("item must be a JSON object");
  if (typeof v.narrative !== "string") throw new FolioParseError("'narrative' must be a string");
  if (!v.payload || typeof v.payload !== "object" || Array.isArray(v.payload))
    throw new FolioParseError("'payload' must be an object");
  return v as Item;
}

/** Serializes the JSON form: envelope fields, then `narrative`, then `payload`. */
export function toJson(item: Item, indent = 2): string {
  const ordered = makeItem(orderEnvelope(envelopeOf(item)), item.narrative ?? "", item.payload ?? {});
  return JSON.stringify(ordered, null, indent);
}

/** Known envelope fields in recommended order, then unknown ones in their existing order. */
function orderEnvelope(env: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const k of ENVELOPE_ORDER) if (k in env && env[k] !== undefined) out[k] = env[k];
  for (const [k, v] of Object.entries(env)) if (!(k in out) && v !== undefined) out[k] = v;
  return out;
}

// --- Canonical YAML emitter for envelope values (JSON-compatible values only). ---

function yamlKey(k: string): string {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(k) ? k : JSON.stringify(k);
}

function yamlScalar(v: unknown): string {
  if (typeof v === "string") return JSON.stringify(v);
  if (v === null) return "null";
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  throw new Error(`cannot emit ${typeof v} as YAML scalar`);
}

function emitYaml(obj: Record<string, unknown>, indent = ""): string {
  let out = "";
  for (const [k, v] of Object.entries(obj)) {
    out += emitEntry(`${indent}${yamlKey(k)}:`, v, indent);
  }
  return out;
}

function emitEntry(head: string, v: unknown, indent: string): string {
  if (Array.isArray(v)) {
    if (v.length === 0) return `${head} []\n`;
    let out = `${head}\n`;
    for (const el of v) out += emitListItem(el, indent + "  ");
    return out;
  }
  if (v && typeof v === "object") {
    if (Object.keys(v).length === 0) return `${head} {}\n`;
    return `${head}\n` + emitYaml(v as Record<string, unknown>, indent + "  ");
  }
  return `${head} ${yamlScalar(v)}\n`;
}

function emitListItem(el: unknown, indent: string): string {
  if (Array.isArray(el)) {
    if (el.length === 0) return `${indent}- []\n`;
    // Nested sequence: put it on the following lines.
    let out = `${indent}-\n`;
    for (const x of el) out += emitListItem(x, indent + "  ");
    return out;
  }
  if (el && typeof el === "object") {
    const entries = Object.entries(el);
    if (entries.length === 0) return `${indent}- {}\n`;
    const body = emitYaml(el as Record<string, unknown>, indent + "  ");
    return `${indent}- ${body.slice(indent.length + 2)}`;
  }
  return `${indent}- ${yamlScalar(el)}\n`;
}

/** Forgets remembered source formatting (so `toMarkdown` uses the canonical layout). */
export function canonicalCopy(item: Item): Item {
  return structuredClone(item);
}
