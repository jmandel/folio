// did:web resolution (https://w3c-ccg.github.io/did-method-web/) with a pluggable fetch.
//
//   did:web:example.com              → https://example.com/.well-known/did.json
//   did:web:example.com:org:unit     → https://example.com/org/unit/did.json
//   did:web:localhost%3A8101         → https://localhost:8101/.well-known/did.json
//
// For development, `hostMap` rewrites the HTTPS origin of a DID to a local base URL
// (e.g. "lakeview-labs.example" → "http://localhost:8103"), so items keep their real issuer DIDs
// while nodes run on localhost.

export interface PublicJwk {
  kty: string;
  crv?: string;
  x?: string;
  y?: string;
  [k: string]: unknown;
}

export interface VerificationMethod {
  id: string;
  type: string;
  controller: string;
  publicKeyJwk?: PublicJwk;
}

export interface DidDocument {
  "@context"?: unknown;
  id: string;
  verificationMethod?: VerificationMethod[];
  assertionMethod?: (string | VerificationMethod)[];
  [k: string]: unknown;
}

export type FetchLike = (url: string) => Promise<{ ok: boolean; status: number; json(): Promise<unknown> }>;

export interface Resolver {
  /** Resolves a DID URL with a fragment (a `kid`) to an assertion key of that DID. */
  resolveKey(kid: string): Promise<{ did: string; method: VerificationMethod; jwk: PublicJwk }>;
  resolveDid(did: string): Promise<DidDocument>;
}

/** The HTTPS URL of a did:web DID document. */
export function didWebUrl(did: string): URL {
  if (!did.startsWith("did:web:")) throw new Error(`not a did:web DID: ${did}`);
  const parts = did.slice("did:web:".length).split(":");
  if (!parts[0]) throw new Error(`malformed did:web: ${did}`);
  const host = decodeURIComponent(parts[0]);
  const path = parts.slice(1).map(decodeURIComponent);
  const url = path.length ? `https://${host}/${path.join("/")}/did.json` : `https://${host}/.well-known/did.json`;
  return new URL(url);
}

/** The host (with port) a did:web DID names, e.g. "lakeview-labs.example". */
export function didWebHost(did: string): string {
  return didWebUrl(did).host;
}

export interface DidWebResolverOptions {
  fetch?: FetchLike;
  /** host → base URL (scheme://host[:port]) used instead of https://host. */
  hostMap?: Record<string, string>;
  /** Pre-loaded documents by DID (no network at all). */
  documents?: Record<string, DidDocument>;
}

/** Rewrites an https URL through a host map (also used for schema URLs). */
export function mapUrl(url: string, hostMap: Record<string, string> = {}): string {
  const u = new URL(url);
  const base = hostMap[u.host];
  if (!base) return url;
  return base.replace(/\/$/, "") + u.pathname + u.search;
}

export function createDidWebResolver(opts: DidWebResolverOptions = {}): Resolver {
  const doFetch: FetchLike = opts.fetch ?? ((u) => fetch(u));
  const cache = new Map<string, Promise<DidDocument>>();
  async function load(did: string): Promise<DidDocument> {
    if (opts.documents?.[did]) return opts.documents[did];
    const url = mapUrl(didWebUrl(did).toString(), opts.hostMap);
    const res = await doFetch(url);
    if (!res.ok) throw new Error(`did:web resolution failed for ${did}: HTTP ${res.status} from ${url}`);
    const doc = (await res.json()) as DidDocument;
    if (doc?.id !== did) throw new Error(`DID document at ${url} has id ${doc?.id}, expected ${did}`);
    return doc;
  }
  const resolveDid = (did: string) => {
    let p = cache.get(did);
    if (!p) {
      p = load(did);
      p.catch(() => cache.delete(did));
      cache.set(did, p);
    }
    return p;
  };
  return {
    resolveDid,
    async resolveKey(kid: string) {
      const hash = kid.indexOf("#");
      if (hash < 1) throw new Error(`kid must be a DID URL with a fragment: ${kid}`);
      const did = kid.slice(0, hash);
      const doc = await resolveDid(did);
      const methods = doc.verificationMethod ?? [];
      const abs = (id: string) => (id.startsWith("#") ? did + id : id);
      const method =
        methods.find((m) => abs(m.id) === kid) ??
        (doc.assertionMethod ?? []).find((m): m is VerificationMethod => typeof m === "object" && abs(m.id) === kid);
      if (!method) throw new Error(`key ${kid} not found in DID document of ${did}`);
      const asserted = (doc.assertionMethod ?? []).some((m) => abs(typeof m === "string" ? m : m.id) === kid);
      if (!asserted) throw new Error(`key ${kid} is not an assertionMethod of ${did}`);
      if (method.controller && method.controller !== did) throw new Error(`key ${kid} is controlled by ${method.controller}, not ${did}`);
      if (!method.publicKeyJwk) throw new Error(`key ${kid} has no publicKeyJwk`);
      if ("d" in method.publicKeyJwk) throw new Error(`key ${kid} publishes private key material`);
      return { did, method, jwk: method.publicKeyJwk };
    },
  };
}

/** Builds the DID document for a did:web issuer with one Ed25519 assertion key. */
export function makeDidDocument(did: string, kid: string, publicJwk: PublicJwk): DidDocument {
  return {
    "@context": ["https://www.w3.org/ns/did/v1", "https://w3id.org/security/suites/jws-2020/v1"],
    id: did,
    verificationMethod: [{ id: kid, type: "JsonWebKey2020", controller: did, publicKeyJwk: publicJwk }],
    assertionMethod: [kid],
  };
}
