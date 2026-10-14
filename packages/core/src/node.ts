// Filesystem helpers for Bun/Node: reading items and demo issuer keys from the repo layout.
//
//   sources/<source>/keys/issuer-key.json   DEMO-ONLY private key + DID (see scripts/gen-dev-keys.ts)
//   sources/<source>/keys/did.json          the DID document a sync node serves
//   sources/<source>/schema/*.d.ts          schemas, served by URL and by hash

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { parseMarkdown, parseJson } from "./markdown.ts";
import type { Item } from "./item.ts";
import type { DidDocument } from "./did.ts";
import type { IssuerKey } from "./sdjwt.ts";

export interface DemoKeyFile extends IssuerKey {
  WARNING: string;
  publicJwk: JsonWebKey;
}

export function loadIssuerKey(keysDir: string): IssuerKey {
  const k = JSON.parse(readFileSync(join(keysDir, "issuer-key.json"), "utf8")) as DemoKeyFile;
  return { did: k.did, kid: k.kid, privateJwk: k.privateJwk };
}

export function loadDidDocument(keysDir: string): DidDocument {
  return JSON.parse(readFileSync(join(keysDir, "did.json"), "utf8"));
}

/** Recursively lists `*.folio.md`, `*.folio.json` and pre-signed `*.folio.sd-jwt` files under a directory, sorted by path. */
export function listItemFiles(dir: string): string[] {
  const out: string[] = [];
  const walk = (d: string) => {
    for (const name of readdirSync(d).sort()) {
      if (name.startsWith(".")) continue;
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith(".folio.md") || name.endsWith(".folio.json") || name.endsWith(".folio.sd-jwt")) out.push(p);
    }
  };
  walk(dir);
  return out;
}

export function readItemFile(path: string): Item {
  const text = readFileSync(path, "utf8");
  return path.endsWith(".folio.json") ? parseJson(text) : parseMarkdown(text);
}
