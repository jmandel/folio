// Generates one DEMO-ONLY Ed25519 issuer key per source, plus its did:web DID document.
//
//   bun packages/core/scripts/gen-dev-keys.ts [--force]
//
// Writes sources/<source>/keys/issuer-key.json (private key, committed on purpose: these keys sign
// synthetic data in a public repo and must never sign anything real) and sources/<source>/keys/did.json.
// The issuer DID is read from the source's example items.
//
// Why Ed25519 rather than ES256: signatures are deterministic (no per-signature nonce to get
// wrong), keys and signatures are small, the JWK is one 32-byte value, and WebCrypto supports it in
// Bun and current browsers, so the workbench can verify in the page. JOSE alg is "EdDSA".

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { makeDidDocument, type PublicJwk } from "../src/did.ts";

const ROOT = resolve(import.meta.dir, "../../..");
const force = process.argv.includes("--force");
const KEY_NAME = "folio-demo-1";

for (const source of readdirSync(join(ROOT, "sources")).sort()) {
  const exDir = join(ROOT, "sources", source, "examples");
  if (!existsSync(exDir)) continue;
  const first = readdirSync(exDir).find((f) => f.endsWith(".folio.md"));
  const did = first && readFileSync(join(exDir, first), "utf8").match(/^issuer:\s*"([^"]+)"/m)?.[1];
  if (!did) { console.log(`${source}: no issuer found, skipped`); continue; }
  const keysDir = join(ROOT, "sources", source, "keys");
  const keyPath = join(keysDir, "issuer-key.json");
  if (existsSync(keyPath) && !force) { console.log(`${source}: key exists (use --force to replace)`); continue; }
  mkdirSync(keysDir, { recursive: true });
  const kp = (await crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"])) as CryptoKeyPair;
  const priv = await crypto.subtle.exportKey("jwk", kp.privateKey);
  const pub = await crypto.subtle.exportKey("jwk", kp.publicKey);
  const kid = `${did}#${KEY_NAME}`;
  const privateJwk = { kty: priv.kty, crv: priv.crv, x: priv.x, d: priv.d };
  const publicJwk = { kty: pub.kty, crv: pub.crv, x: pub.x };
  const keyFile = {
    WARNING: "DEMO KEY ONLY. Published in a public repository to sign synthetic data. Never use it to sign real records.",
    did,
    kid,
    publicJwk,
    privateJwk,
  };
  writeFileSync(keyPath, JSON.stringify(keyFile, null, 2) + "\n");
  writeFileSync(join(keysDir, "did.json"), JSON.stringify(makeDidDocument(did, kid, publicJwk as PublicJwk), null, 2) + "\n");
  console.log(`${source}: wrote ${kid}`);
}
