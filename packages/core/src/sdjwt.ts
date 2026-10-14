// Signing and selective disclosure of record items: the SD-JWT profile in spec/signing.md.
//
// Library choice: @sd-jwt/core (OpenWallet Foundation, Apache-2.0, "SD-JWT RFC 9901
// implementation"). It fits cleanly: we hand it the claim set and a disclosure frame
// (`units._sd = [every unit id]`), and plug in our own Ed25519 signer/verifier and SHA-256 hasher
// built on WebCrypto, so this module runs unchanged in Bun and in the browser. It already rejects
// unreferenced and duplicate disclosures and `alg: none`. Everything FOLIO-specific (how an item
// becomes claims, and how a verified claim set becomes an item with withheld markers) is here.

import { SDJwtInstance, decodeSdJwt } from "@sd-jwt/core";
import { envelopeOf, makeItem, type Envelope, type Item, type Payload } from "./item.ts";
import { refElement, segmentNarrative } from "./refs.ts";
import { assertValid } from "./validate.ts";
import type { PublicJwk, Resolver } from "./did.ts";

export const SD_JWT_TYP = "folio-item+sd-jwt";
export const SIGN_ALG = "EdDSA";
/** Reference marker for a withheld span when rendering as text. */
export const WITHHELD_MARKER = "⟦withheld⟧";

/** An issuer's signing key: its DID, the DID URL of the key, and the private JWK (OKP, Ed25519). */
export interface IssuerKey {
  did: string;
  kid: string;
  privateJwk: JsonWebKey;
}

/** A unit's disclosure value (the third element of the SD-JWT disclosure array). */
export interface UnitValue {
  /** The payload entry, exactly as in the item. Absent for a narrative-only span. */
  entry?: unknown;
  /** Index of the entry in the payload's key order. Present iff `entry` is. */
  pos?: number;
  /** The unit's spans: which narrative slot each fills, and its exact inner text. */
  spans?: { slot: number; text: string }[];
}

/** The issuer-signed claim set. */
export interface FolioClaims {
  iss: string;
  envelope: Envelope;
  /** Prose outside spans: `narrative[k]` precedes slot k; the last element follows the last slot. */
  narrative: string[];
  units: Record<string, UnitValue>;
  [k: string]: unknown;
}

const enc = new TextEncoder();
const b64u = (bytes: ArrayBuffer | Uint8Array): string => {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (const b of u8) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const fromB64u = (s: string): Uint8Array => {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};

async function hasher(data: string | ArrayBuffer, alg: string): Promise<Uint8Array> {
  if (alg.toLowerCase() !== "sha-256") throw new Error(`unsupported hash ${alg}`);
  const bytes = typeof data === "string" ? enc.encode(data) : new Uint8Array(data);
  return new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
}

const saltGenerator = (n: number) => b64u(crypto.getRandomValues(new Uint8Array(Math.max(16, n))));

function decodePart(part: string): any {
  return JSON.parse(new TextDecoder().decode(fromB64u(part)));
}

async function importPrivate(jwk: JsonWebKey): Promise<CryptoKey> {
  if (jwk.kty !== "OKP" || jwk.crv !== "Ed25519") throw new Error("issuer key must be an OKP Ed25519 JWK");
  return crypto.subtle.importKey("jwk", jwk, { name: "Ed25519" }, false, ["sign"]);
}

async function importPublic(jwk: PublicJwk): Promise<CryptoKey> {
  if (jwk.kty !== "OKP" || jwk.crv !== "Ed25519") throw new Error("issuer public key must be an OKP Ed25519 JWK");
  const { kty, crv, x } = jwk;
  return crypto.subtle.importKey("jwk", { kty, crv, x } as JsonWebKey, { name: "Ed25519" }, false, ["verify"]);
}

/** Item → issuer-signed claim set and the list of unit ids (all selectively disclosable). */
export function itemToClaims(item: Item): FolioClaims {
  const { segments, slots } = segmentNarrative(item.narrative);
  const units: Record<string, UnitValue> = {};
  Object.entries(item.payload).forEach(([id, entry], pos) => (units[id] = { entry, pos }));
  slots.forEach((s, slot) => {
    const u = (units[s.id] ??= {});
    (u.spans ??= []).push({ slot, text: s.text });
  });
  return { iss: item.issuer, envelope: envelopeOf(item), narrative: segments, units };
}

/** Signs an item. The result is an SD-JWT carrying every disclosure (what a sync node serves). */
export async function sign(item: Item, key: IssuerKey): Promise<string> {
  assertValid(item);
  if (item.issuer !== key.did) throw new Error(`item issuer ${item.issuer} does not match key DID ${key.did}`);
  if (!key.kid.startsWith(key.did + "#")) throw new Error(`kid ${key.kid} is not a key of ${key.did}`);
  const priv = await importPrivate(key.privateJwk);
  const sd = new SDJwtInstance<FolioClaims>({
    hasher,
    hashAlg: "sha-256",
    saltGenerator,
    signAlg: SIGN_ALG,
    signer: async (data) => b64u(await crypto.subtle.sign("Ed25519", priv, enc.encode(data))),
  });
  const claims = itemToClaims(item);
  const ids = Object.keys(claims.units);
  return sd.issue(claims, { units: { _sd: ids } } as any, { header: { typ: SD_JWT_TYP, kid: key.kid } });
}

export interface UnitInfo {
  id: string;
  hasEntry: boolean;
  /** Narrative slots this unit fills (empty for an entry without spans). */
  slots: number[];
  /** Span texts, for showing a presenter what each unit contains. */
  spanTexts: string[];
  entry?: unknown;
}

/** Lists the disclosure units carried by a signed item or presentation (no verification). */
export async function listUnits(sdJwt: string): Promise<UnitInfo[]> {
  const decoded = await decodeSdJwt(sdJwt, hasher);
  const out: UnitInfo[] = [];
  for (const d of decoded.disclosures) {
    if (d.key === undefined) continue;
    const v = (d.value ?? {}) as UnitValue;
    out.push({
      id: d.key,
      hasEntry: "entry" in v,
      slots: (v.spans ?? []).map((s) => s.slot),
      spanTexts: (v.spans ?? []).map((s) => s.text),
      entry: v.entry,
    });
  }
  return out;
}

/**
 * Makes a presentation that discloses only the named units (payload entry ids and narrative-only
 * span ids). The envelope and the prose outside spans are always included.
 */
export async function present(signed: string, discloseIds: Iterable<string>): Promise<string> {
  const ids = [...new Set(discloseIds)];
  const available = new Set((await listUnits(signed)).map((u) => u.id));
  const missing = ids.filter((id) => !available.has(id));
  if (missing.length) throw new Error(`no disclosure for unit(s): ${missing.join(", ")}`);
  const sd = new SDJwtInstance<FolioClaims>({ hasher, hashAlg: "sha-256" });
  const frame: Record<string, true> = {};
  for (const id of ids) frame[id] = true;
  return sd.present(signed, { units: frame } as any);
}

/** Convenience: a presentation with everything except the named units. */
export async function presentWithholding(signed: string, withholdIds: Iterable<string>): Promise<string> {
  const withhold = new Set(withholdIds);
  const units = await listUnits(signed);
  const unknown = [...withhold].filter((id) => !units.some((u) => u.id === id));
  if (unknown.length) throw new Error(`no disclosure for unit(s): ${unknown.join(", ")}`);
  return present(signed, units.map((u) => u.id).filter((id) => !withhold.has(id)));
}

export type NarrativePart =
  | { kind: "prose"; text: string }
  | { kind: "span"; slot: number; id: string; text: string }
  | { kind: "withheld"; slot: number };

export interface VerifiedItem {
  envelope: Envelope;
  /** True when nothing was withheld. */
  complete: boolean;
  /** The whole item; present only when `complete`. */
  item?: Item;
  /** Disclosed payload entries, in the issuer's order. */
  payload: Payload;
  /** Narrative pieces in order, with withheld slots in place. */
  parts: NarrativePart[];
  /** Ids of the units that were disclosed. */
  disclosed: string[];
  withheld: {
    /** Narrative slots whose span was withheld. */
    slots: number[];
    /**
     * Number of withheld units (payload entries and narrative-only spans together). Withheld slots
     * cannot be attributed to units, so this is the only exact count a receiver has.
     */
    units: number;
  };
  kid: string;
}

export class VerificationError extends Error {}

export interface VerifyOptions {
  /** Expected issuer DID, if the caller knows whom the item should come from. */
  expectedIssuer?: string;
}

/** Verifies a signed item or presentation against the issuer's did:web key. Throws VerificationError. */
export async function verify(sdJwt: string, resolver: Resolver, opts: VerifyOptions = {}): Promise<VerifiedItem> {
  const fail = (m: string): never => {
    throw new VerificationError(m);
  };
  const parts = sdJwt.split("~");
  if (parts.length < 2) fail("not an SD-JWT (no '~' separator)");
  if (parts[parts.length - 1] !== "") fail("key binding JWTs are not used in this profile; presentation must end with '~'");
  const [h, p] = parts[0].split(".");
  let header: any, raw: any;
  try {
    header = decodePart(h);
    raw = decodePart(p);
  } catch {
    fail("issuer-signed JWT is not decodable");
  }
  if (header.typ !== SD_JWT_TYP) fail(`typ must be ${SD_JWT_TYP}`);
  if (header.alg !== SIGN_ALG) fail(`alg must be ${SIGN_ALG}`);
  if (typeof header.kid !== "string") fail("kid missing");
  const iss = raw?.iss;
  if (typeof iss !== "string" || !header.kid.startsWith(iss + "#")) fail("kid is not a key of the iss DID");
  if (opts.expectedIssuer && iss !== opts.expectedIssuer) fail(`issuer ${iss} is not the expected ${opts.expectedIssuer}`);

  let key: CryptoKey;
  try {
    key = await importPublic((await resolver.resolveKey(header.kid)).jwk);
  } catch (e) {
    return fail(`key resolution failed: ${(e as Error).message}`);
  }
  const sd = new SDJwtInstance<FolioClaims>({
    hasher,
    hashAlg: "sha-256",
    verifier: async (data, sig) => crypto.subtle.verify("Ed25519", key, fromB64u(sig), enc.encode(data)),
  });
  let claims: FolioClaims;
  try {
    claims = (await sd.verify(sdJwt, { allowedIssuerAlgorithms: [SIGN_ALG] } as any)).payload;
  } catch (e) {
    return fail(`SD-JWT verification failed: ${(e as Error).message}`);
  }

  // FOLIO structure checks on the verified claims.
  const env = claims.envelope;
  if (!env || typeof env !== "object") fail("envelope claim missing");
  if (env.issuer !== iss) fail("envelope issuer does not match iss");
  const segs = claims.narrative;
  if (!Array.isArray(segs) || segs.length < 1 || segs.some((s) => typeof s !== "string")) fail("narrative claim malformed");
  if (segs.some((s) => s.includes("<ref") || s.includes("</ref>"))) fail("prose segment contains a ref tag");
  const slotCount = segs.length - 1;
  const totalUnits = Array.isArray(raw.units?._sd) ? raw.units._sd.length : fail("units claim malformed");
  const units = claims.units ?? {};
  const slotFill = new Map<number, { id: string; text: string }>();
  const entries: [number, string, unknown][] = [];
  const positions = new Set<number>();
  for (const [id, v] of Object.entries(units)) {
    if (!v || typeof v !== "object") fail(`unit ${id} malformed`);
    const hasEntry = "entry" in v;
    if (!hasEntry && !v.spans?.length) fail(`unit ${id} has neither entry nor spans`);
    if (hasEntry) {
      if (!Number.isInteger(v.pos) || v.pos! < 0 || v.pos! >= totalUnits || positions.has(v.pos!)) fail(`unit ${id} has a bad pos`);
      positions.add(v.pos!);
      entries.push([v.pos!, id, v.entry]);
    } else if ("pos" in v) fail(`unit ${id} has pos without entry`);
    for (const s of v.spans ?? []) {
      if (!Number.isInteger(s.slot) || s.slot < 0 || s.slot >= slotCount) fail(`unit ${id} names slot ${s.slot}, out of range`);
      if (slotFill.has(s.slot)) fail(`slot ${s.slot} is filled twice`);
      if (typeof s.text !== "string" || s.text.includes("<ref") || s.text.includes("</ref>")) fail(`unit ${id} span text malformed`);
      slotFill.set(s.slot, { id, text: s.text });
    }
  }
  const disclosed = Object.keys(units);
  const narrativeParts: NarrativePart[] = [];
  const withheldSlots: number[] = [];
  segs.forEach((text, k) => {
    if (text) narrativeParts.push({ kind: "prose", text });
    if (k < slotCount) {
      const f = slotFill.get(k);
      if (f) narrativeParts.push({ kind: "span", slot: k, id: f.id, text: f.text });
      else {
        narrativeParts.push({ kind: "withheld", slot: k });
        withheldSlots.push(k);
      }
    }
  });
  entries.sort((a, b) => a[0] - b[0]);
  const payload: Payload = {};
  for (const [, id, e] of entries) payload[id] = e;
  const withheldUnits = totalUnits - disclosed.length;
  const complete = withheldUnits === 0;
  const result: VerifiedItem = {
    envelope: env,
    complete,
    payload,
    parts: narrativeParts,
    disclosed,
    withheld: { slots: withheldSlots, units: withheldUnits },
    kid: header.kid,
  };
  if (complete) {
    const narrative = narrativeParts.map((p) => (p.kind === "span" ? refElement(p.id, p.text) : p.kind === "prose" ? p.text : "")).join("");
    const item = makeItem(env, narrative, payload);
    try {
      assertValid(item);
    } catch (e) {
      fail(`verified item is not a valid record item: ${(e as Error).message}`);
    }
    result.item = item;
  }
  return result;
}

/** The narrative with withheld spans replaced by a visible marker (ref tags of disclosed spans kept). */
export function narrativeWithMarkers(v: VerifiedItem, marker = WITHHELD_MARKER): string {
  return v.parts
    .map((p) => (p.kind === "prose" ? p.text : p.kind === "span" ? refElement(p.id, p.text) : marker))
    .join("");
}

/**
 * Plain-text rendering for terminals and logs. A partial item says so first, marks each withheld
 * span in place, and counts withheld structured entries.
 */
export function renderVerified(v: VerifiedItem, marker = WITHHELD_MARKER): string {
  const e = v.envelope;
  const lines: string[] = [];
  if (!v.complete) {
    lines.push(
      `PARTIAL ITEM: the presenter withheld ${v.withheld.units} of ${v.withheld.units + v.disclosed.length} part(s). ` +
        `Do not read it as the complete record.`,
    );
  }
  lines.push(`issuer ${e.issuer}  item ${e.id}  patient ${e.patient}`);
  lines.push(`effective ${e.effective}${e.effective_end ? " – " + e.effective_end : ""}  recorded ${e.recorded}`);
  if (e.author?.name) lines.push(`author ${e.author.name}${e.author.role ? ` (${e.author.role})` : ""}`);
  if (e.schema) lines.push(`schema ${e.schema.type} @ ${e.schema.url}`);
  if (e.supersedes?.length) lines.push(`supersedes ${e.supersedes.join(", ")}`);
  if (e.retracts?.length) lines.push(`retracts ${e.retracts.join(", ")}`);
  const narrative = v.parts.map((p) => (p.kind === "withheld" ? marker : p.text)).join("");
  if (narrative.trim()) lines.push("", narrative);
  const ids = Object.keys(v.payload);
  if (ids.length || v.withheld.units) {
    lines.push("", "payload:");
    for (const id of ids) lines.push(`  ${id}: ${JSON.stringify(v.payload[id])}`);
    if (v.withheld.units)
      lines.push(
        `  ${marker} ${v.withheld.units} part(s) withheld` +
          (v.withheld.slots.length ? ` (${v.withheld.slots.length} span(s) marked in place above)` : "") +
          `; structured entries may be among them`,
      );
  }
  return lines.join("\n");
}
