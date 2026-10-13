// Writes the real SHA-256 of each source schema file into `schema.sha256` of every example item.
// Run from the repo root after any schema edit:
//
//   bun work/schema-hashes.ts           rewrite the hashes
//   bun work/schema-hashes.ts --check   only report examples whose hash is stale (exit 1 if any)

import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dir, "..");
const check = process.argv.includes("--check");
let stale = 0;

for (const source of readdirSync(join(ROOT, "sources"))) {
  const schemaDir = join(ROOT, "sources", source, "schema");
  const hashes = new Map<string, string>();
  for (const f of readdirSync(schemaDir).filter((f) => f.endsWith(".d.ts")))
    hashes.set(f, createHash("sha256").update(readFileSync(join(schemaDir, f))).digest("hex"));

  const exDir = join(ROOT, "sources", source, "examples");
  for (const file of readdirSync(exDir).filter((f) => f.endsWith(".folio.md"))) {
    const path = join(exDir, file);
    const text = readFileSync(path, "utf8");
    const url = text.match(/^\s+url:\s*"([^"]*)"/m)?.[1];
    if (!url) continue; // no payload, no schema
    const hash = hashes.get(url.slice(url.lastIndexOf("/") + 1));
    if (!hash) { console.log(`${source}/${file}: schema ${url} not found`); stale++; continue; }
    const updated = text.replace(/^(\s+sha256:\s*)"[^"]*"/m, `$1"${hash}"`);
    if (updated === text) continue;
    stale++;
    if (check) console.log(`${source}/${file}: stale schema.sha256`);
    else writeFileSync(path, updated);
  }
}

if (check) {
  console.log(stale ? `${stale} example(s) stale.` : "All schema hashes current.");
  process.exit(stale ? 1 : 0);
}
console.log(`Updated ${stale} example(s).`);
