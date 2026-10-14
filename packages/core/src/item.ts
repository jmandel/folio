// The record item model (spec/record-item.md). An Item is the JSON form: envelope fields at top
// level, plus `narrative` and `payload`.

export const FOLIO_VERSION = "0.1";

/** Envelope fields in the spec's recommended order. Unknown envelope fields follow, in input order. */
export const ENVELOPE_ORDER = [
  "folio",
  "id",
  "issuer",
  "patient",
  "effective",
  "effective_end",
  "recorded",
  "author",
  "schema",
  "supersedes",
  "retracts",
] as const;

export interface Author {
  id?: string;
  name?: string;
  role?: string;
  [k: string]: unknown;
}

export interface SchemaRef {
  url: string;
  type: string;
  sha256: string;
}

export interface Envelope {
  folio: string;
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
  [k: string]: unknown;
}

export type Payload = Record<string, unknown>;

export interface Item extends Envelope {
  narrative: string;
  payload: Payload;
}

/** The envelope part of an item (everything except `narrative` and `payload`), order preserved. */
export function envelopeOf(item: Item): Envelope {
  const env: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(item)) if (k !== "narrative" && k !== "payload") env[k] = v;
  return env as Envelope;
}

/** Builds an item from an envelope, narrative and payload, in JSON-form key order. */
export function makeItem(envelope: Record<string, unknown>, narrative: string, payload: Payload): Item {
  return { ...envelope, narrative, payload } as Item;
}

/** Deep structural equality for JSON values; object key order is significant when `ordered`. */
export function jsonEqual(a: unknown, b: unknown, ordered = true): boolean {
  if (a === b) return true;
  if (typeof a !== typeof b || a === null || b === null || typeof a !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    const bb = b as unknown[];
    return a.length === bb.length && a.every((x, i) => jsonEqual(x, bb[i], ordered));
  }
  const ka = Object.keys(a as object);
  const kb = Object.keys(b as object);
  if (ka.length !== kb.length) return false;
  if (ordered && ka.some((k, i) => k !== kb[i])) return false;
  return ka.every((k) => k in (b as object) && jsonEqual((a as any)[k], (b as any)[k], ordered));
}

/** Global identity of an item. */
export function itemKey(item: { issuer: string; id: string }): string {
  return `${item.issuer} ${item.id}`;
}
