// Structural validation of a record item against spec/record-item.md. This checks the envelope,
// narrative and ref rules, and payload shape. It does not type-check entries against the schema's
// .d.ts (that needs the TypeScript compiler; see work/check-examples.ts).

import { extractRefs, ID_PATTERN } from "./refs.ts";
import type { Item } from "./item.ts";
import { FOLIO_VERSION } from "./item.ts";

export interface Issue {
  path: string;
  message: string;
}

export const ULID_PATTERN = /^[0-9A-HJKMNP-TV-Z]{26}$/;
export const DATE_PARTIAL = /^\d{4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/;
export const DATETIME_OFFSET =
  /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T([01]\d|2[0-3]):[0-5]\d(:[0-5]\d(\.\d+)?)?(Z|[+-]([01]\d|2[0-3]):[0-5]\d)$/;
const SHA256_HEX = /^[0-9a-f]{64}$/;
const DID_WEB = /^did:web:[A-Za-z0-9.%-]+(:[A-Za-z0-9._~%-]+)*$/;
/** Raw HTML tags other than <ref>/</ref>. `<0.01` and `<5` are text, not tags. */
const HTML_TAG = /<\/?([A-Za-z][A-Za-z0-9-]*)(\s[^<>]*)?\/?>/g;

export function validateItem(item: Item): Issue[] {
  const issues: Issue[] = [];
  const bad = (path: string, message: string) => issues.push({ path, message });
  const str = (k: string) => typeof (item as any)[k] === "string";

  if (item.folio !== FOLIO_VERSION) bad("folio", `must be the string "${FOLIO_VERSION}"`);
  if (!str("id") || !ULID_PATTERN.test(item.id)) bad("id", "must be a ULID (26 Crockford base32 characters)");
  if (!str("issuer") || !DID_WEB.test(item.issuer)) bad("issuer", "must be a did:web URI");
  if (!str("patient") || item.patient === "") bad("patient", "required string");
  for (const k of ["effective", "effective_end"] as const) {
    const v = (item as any)[k];
    if (v === undefined && k === "effective_end") continue;
    if (typeof v !== "string" || !(DATE_PARTIAL.test(v) || DATETIME_OFFSET.test(v)))
      bad(k, "must be an RFC 3339 date-time with offset, or a full or partial date");
  }
  if (!str("recorded") || !DATETIME_OFFSET.test(item.recorded)) bad("recorded", "must be an RFC 3339 date-time with offset");
  if (item.author !== undefined) {
    if (!item.author || typeof item.author !== "object" || Array.isArray(item.author)) bad("author", "must be an object");
    else for (const k of ["id", "name", "role"])
      if ((item.author as any)[k] !== undefined && typeof (item.author as any)[k] !== "string") bad(`author.${k}`, "must be a string");
  }
  const payloadKeys = item.payload && typeof item.payload === "object" && !Array.isArray(item.payload) ? Object.keys(item.payload) : null;
  if (payloadKeys === null) bad("payload", "must be an object");
  const hasPayload = !!payloadKeys?.length;
  if (item.schema !== undefined) {
    const s = item.schema as any;
    if (!s || typeof s !== "object") bad("schema", "must be an object");
    else {
      if (typeof s.url !== "string" || !/^https:\/\/\S+$/.test(s.url)) bad("schema.url", "must be an HTTPS URL");
      if (typeof s.type !== "string" || !s.type) bad("schema.type", "required string");
      if (typeof s.sha256 !== "string" || !SHA256_HEX.test(s.sha256)) bad("schema.sha256", "must be lowercase hex SHA-256");
    }
  } else if (hasPayload) bad("schema", "required when payload is present");
  for (const k of ["supersedes", "retracts"] as const) {
    const v = item[k];
    if (v === undefined) continue;
    if (!Array.isArray(v)) { bad(k, "must be an array of item ids"); continue; }
    v.forEach((x, i) => { if (typeof x !== "string" || !ULID_PATTERN.test(x)) bad(`${k}[${i}]`, "must be a ULID item id"); });
    if (v.includes(item.id)) bad(k, "an item cannot list itself");
  }
  if (typeof item.narrative !== "string") bad("narrative", "must be a string");
  const narrative = typeof item.narrative === "string" ? item.narrative : "";
  if (!narrative.trim() && !hasPayload && !(item.retracts?.length))
    bad("item", "must have a non-empty narrative, payload, or retracts");

  // Narrative rules.
  if (/^(`{3,}|~{3,})json payload\b/m.test(narrative)) bad("narrative", "must not contain a 'json payload' fence");
  for (const m of narrative.matchAll(HTML_TAG)) {
    if (m[1] === "ref") continue;
    bad("narrative", `raw HTML is not allowed (found '${m[0]}')`);
  }
  if (/!\[[^\]]*\]\(/.test(narrative)) bad("narrative", "images are not allowed");
  const refs = extractRefs(narrative);
  for (const e of refs.errors) bad("narrative", e);

  // Entry ids, entry shape.
  for (const k of payloadKeys ?? []) {
    if (!ID_PATTERN.test(k)) bad(`payload.${k}`, `entry id must match ${ID_PATTERN}`);
    const e = (item.payload as any)[k];
    if (!e || typeof e !== "object" || Array.isArray(e)) bad(`payload.${k}`, "entry must be an object");
    else if (typeof e.type !== "string") bad(`payload.${k}.type`, "entry should carry a string 'type' discriminator");
  }
  return issues;
}

/** Ref ids in the narrative that have no payload entry (narrative-only spans). */
export function narrativeOnlyIds(item: Item): string[] {
  const ids = new Set(extractRefs(item.narrative).spans.map((s) => s.id));
  return [...ids].filter((id) => !(id in item.payload));
}

export function assertValid(item: Item): void {
  const issues = validateItem(item);
  if (issues.length) throw new Error(`invalid item ${item.id}: ` + issues.map((i) => `${i.path}: ${i.message}`).join("; "));
}
