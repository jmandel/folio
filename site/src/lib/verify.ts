// Signature and schema checks in the browser, using @folio/core (WebCrypto Ed25519, SHA-256).
//
// DIDs stay as issued (did:web:lakeview-labs.example …). A did:web host map points each issuer host at
// `hosts/<host>` on this site, where the build step placed its did.json and schemas.

import {
  createDidWebResolver,
  didWebHost,
  mapUrl,
  verify,
  type DidDocument,
  type Envelope,
  type NarrativePart,
  type Payload,
  type Resolver,
  type VerifiedItem,
} from "@folio/core";

export const ISSUER_HOSTS = [
  "riverside-regional.example",
  "northgate-fm.example",
  "lakeview-labs.example",
  "homelog.example",
];

export function hostMap(): Record<string, string> {
  const m: Record<string, string> = {};
  for (const h of ISSUER_HOSTS) m[h] = new URL(`hosts/${h}`, document.baseURI).href;
  return m;
}

/** A fresh resolver (each one keeps its own cache of DID documents). */
export function newResolver(): Resolver {
  return createDidWebResolver({ hostMap: hostMap() });
}

let shared: Resolver | undefined;
export const sharedResolver = () => (shared ??= newResolver());

export function didDocumentUrl(did: string): string {
  return mapUrl(`https://${didWebHost(did)}/.well-known/did.json`, hostMap());
}

export type Check =
  | { ok: true; v: VerifiedItem; ms: number }
  | { ok: false; error: string; decoded: Decoded | null; ms: number };

export async function check(sdJwt: string, resolver = sharedResolver()): Promise<Check> {
  const t0 = performance.now();
  try {
    const v = await verify(sdJwt, resolver);
    return { ok: true, v, ms: performance.now() - t0 };
  } catch (e) {
    let decoded: Decoded | null = null;
    try {
      decoded = decodeUnverified(sdJwt);
    } catch {
      /* undecodable */
    }
    return { ok: false, error: (e as Error).message, decoded, ms: performance.now() - t0 };
  }
}

// ─── decoding without verification (to show what a failed item claimed) ─────────────────────────

export interface Decoded {
  envelope: Envelope;
  parts: NarrativePart[];
  payload: Payload;
}

const b64uToBytes = (s: string) => {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};
const bytesToB64u = (u8: Uint8Array) => {
  let s = "";
  for (const b of u8) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const decodeJsonPart = (p: string) => JSON.parse(new TextDecoder().decode(b64uToBytes(p)));
const encodeJsonText = (text: string) => bytesToB64u(new TextEncoder().encode(text));

export function decodeUnverified(sdJwt: string): Decoded {
  const [jwt, ...disc] = sdJwt.split("~");
  const claims = decodeJsonPart(jwt.split(".")[1]);
  const slots = new Map<number, { id: string; text: string }>();
  const entries: [number, string, unknown][] = [];
  for (const d of disc.filter(Boolean)) {
    const [, id, v] = decodeJsonPart(d);
    if (v && "entry" in v) entries.push([v.pos, id, v.entry]);
    for (const s of v?.spans ?? []) slots.set(s.slot, { id, text: s.text });
  }
  const segs: string[] = claims.narrative ?? [""];
  const parts: NarrativePart[] = [];
  segs.forEach((text, k) => {
    if (text) parts.push({ kind: "prose", text });
    if (k < segs.length - 1) {
      const f = slots.get(k);
      parts.push(f ? { kind: "span", slot: k, id: f.id, text: f.text } : { kind: "withheld", slot: k });
    }
  });
  entries.sort((a, b) => a[0] - b[0]);
  const payload: Payload = {};
  for (const [, id, e] of entries) payload[id] = e;
  return { envelope: claims.envelope, parts, payload };
}

/** Header and claims of the issuer-signed JWT, for the details panel. */
export function jwtParts(sdJwt: string): { header: any; claims: any; disclosures: string[] } {
  const [jwt, ...disc] = sdJwt.split("~");
  const [h, p] = jwt.split(".");
  return { header: decodeJsonPart(h), claims: decodeJsonPart(p), disclosures: disc.filter(Boolean) };
}

// ─── tampering (for showing that a changed character breaks the check) ──────────────────────────

/** Changes one character of the item's content and returns the altered SD-JWT and what changed. */
export function tamper(sdJwt: string): { sdJwt: string; what: string } {
  const parts = sdJwt.split("~");
  // Prefer a disclosed payload entry: change one digit (or letter) in its JSON.
  for (let i = 1; i < parts.length; i++) {
    if (!parts[i]) continue;
    const text = new TextDecoder().decode(b64uToBytes(parts[i]));
    const arr = JSON.parse(text);
    if (!arr[2] || !("entry" in arr[2])) continue;
    const body = JSON.stringify(arr[2].entry);
    const m = /\d/.exec(body) ?? /[a-z]/.exec(body);
    if (!m) continue;
    const ch = m[0];
    const repl = /\d/.test(ch) ? String((+ch + 1) % 10) : ch === "a" ? "e" : "a";
    const at = text.indexOf(body) + m.index;
    const altered = text.slice(0, at) + repl + text.slice(at + 1);
    parts[i] = encodeJsonText(altered);
    const ctxStart = Math.max(0, m.index - 24);
    return {
      sdJwt: parts.join("~"),
      what: `In entry “${arr[1]}”, changed “${ch}” to “${repl}”: …${body.slice(ctxStart, m.index)}[${repl}]${body.slice(m.index + 1, m.index + 20)}…`,
    };
  }
  // Otherwise change one character of the signed prose.
  const [h, p, s] = parts[0].split(".");
  const claims = decodeJsonPart(p);
  const seg = (claims.narrative as string[]).findIndex((x) => /[a-z]/.test(x));
  if (seg < 0) throw new Error("nothing to tamper with");
  const at = claims.narrative[seg].search(/[a-z]/);
  const old = claims.narrative[seg][at];
  claims.narrative[seg] = claims.narrative[seg].slice(0, at) + (old === "a" ? "e" : "a") + claims.narrative[seg].slice(at + 1);
  parts[0] = [h, encodeJsonText(JSON.stringify(claims)), s].join(".");
  return { sdJwt: parts.join("~"), what: `In the signed prose, changed “${old}” to “${old === "a" ? "e" : "a"}”.` };
}

// ─── schema hash check ───────────────────────────────────────────────────────────────────────────

const schemaCache = new Map<string, Promise<{ sha256: string; url: string; bytes: number }>>();
/** Fetches a schema from its (mapped) URL and hashes its exact bytes. */
export function schemaDigest(url: string) {
  let p = schemaCache.get(url);
  if (!p) {
    const local = mapUrl(url, hostMap());
    p = fetch(local).then(async (r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status} from ${local}`);
      const buf = await r.arrayBuffer();
      const d = new Uint8Array(await crypto.subtle.digest("SHA-256", buf));
      return { sha256: [...d].map((b) => b.toString(16).padStart(2, "0")).join(""), url: local, bytes: buf.byteLength };
    });
    schemaCache.set(url, p);
  }
  return p;
}

const didCache = new Map<string, Promise<DidDocument>>();
export function didDocument(did: string): Promise<DidDocument> {
  let p = didCache.get(did);
  if (!p) {
    p = sharedResolver().resolveDid(did);
    didCache.set(did, p);
  }
  return p;
}
