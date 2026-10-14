import { readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { createDidWebResolver, type DidDocument } from "../src/index.ts";
import { loadDidDocument, loadIssuerKey } from "../src/node.ts";

export const ROOT = resolve(import.meta.dir, "../../..");
export const SOURCES = ["riverside", "northgate", "lakeview", "homelog"];

export interface Fixture { source: string; file: string; path: string; text: string }

export function fixtures(): Fixture[] {
  const out: Fixture[] = [];
  for (const source of SOURCES) {
    const dir = join(ROOT, "sources", source, "examples");
    for (const file of readdirSync(dir).filter((f) => f.endsWith(".folio.md")).sort())
      out.push({ source, file, path: join(dir, file), text: readFileSync(join(dir, file), "utf8") });
  }
  return out;
}

export const keyOf = (source: string) => loadIssuerKey(join(ROOT, "sources", source, "keys"));

/** A resolver that serves the committed did.json documents without any network. */
export function localResolver() {
  const documents: Record<string, DidDocument> = {};
  for (const s of SOURCES) {
    const d = loadDidDocument(join(ROOT, "sources", s, "keys"));
    documents[d.id] = d;
  }
  return createDidWebResolver({ documents, fetch: async () => { throw new Error("no network in tests"); } });
}
