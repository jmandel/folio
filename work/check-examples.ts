// Checks every sources/*/examples/*.folio.md against its source schema and the record-item rules
// that can be checked mechanically. Run from the repo root:
//
//   bun work/check-examples.ts
//
// 1. Each payload is type-checked with `tsc --strict --noEmit` as `Record<string, EntryType>`.
// 2. Each <ref id> names a payload key, or is a narrative-only span listed in NARRATIVE_ONLY below
//    (each of which must be mentioned in that source's README).
// 3. Envelope `effective`/`effective_end` carry an offset or are a (possibly partial) date;
//    `recorded` carries an offset. Ref and entry ids match the id pattern.
// 4. `supersedes`/`retracts` hold ULIDs.
// 5. `schema.sha256` is the SHA-256 of the schema file (fix with `bun work/schema-hashes.ts`).

import { readdirSync, readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";

const ROOT = resolve(import.meta.dir, "..");

/** Narrative-only spans the sources document on purpose (source dir → ids). */
const NARRATIVE_ONLY: Record<string, string[]> = {
  riverside: ["precipitant"],
  northgate: ["sick_day"],
  lakeview: ["sglt2_decision", "na_sertraline"],
  homelog: [],
};

const ID = /^[a-z][a-z0-9_]{0,63}$/;
const ULID = /^[0-9A-HJKMNP-TV-Z]{26}$/;
const DATE_PARTIAL = /^\d{4}(-\d{2}(-\d{2})?)?$/;
const DATETIME_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;

const problems: string[] = [];
const tsFiles: string[] = [];
const work = mkdtempSync(join(tmpdir(), "folio-check-"));

function field(front: string, name: string): string | undefined {
  const m = front.match(new RegExp(`^\\s*${name}:\\s*"([^"]*)"`, "m"));
  return m?.[1];
}

function listField(front: string, name: string): string[] {
  const m = front.match(new RegExp(`^${name}:\\n((?:\\s+- .*\\n?)+)`, "m"));
  if (!m) return [];
  return [...m[1].matchAll(/- "?([^"\n]+)"?/g)].map((x) => x[1]);
}

let n = 0;
for (const source of readdirSync(join(ROOT, "sources"))) {
  const exDir = join(ROOT, "sources", source, "examples");
  const schemaDir = join(ROOT, "sources", source, "schema");
  const readme = readFileSync(join(ROOT, "sources", source, "README.md"), "utf8");
  for (const id of NARRATIVE_ONLY[source] ?? []) {
    if (!readme.includes(id)) problems.push(`${source}: narrative-only span '${id}' not documented in README`);
  }
  const schemas = readdirSync(schemaDir).filter((f) => f.endsWith(".d.ts"));
  for (const file of readdirSync(exDir).filter((f) => f.endsWith(".folio.md"))) {
    const where = `${source}/${file}`;
    const text = readFileSync(join(exDir, file), "utf8");
    const fm = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!fm) { problems.push(`${where}: no frontmatter`); continue; }
    const [, front, body] = fm;
    const fence = body.match(/(`{3,})json payload\n([\s\S]*?)\n\1\s*$/);
    const narrative = (fence ? body.slice(0, fence.index) : body).trim();
    const payload: Record<string, unknown> = fence ? JSON.parse(fence[2]) : {};

    // Envelope times.
    for (const f of ["effective", "effective_end"]) {
      const v = field(front, f);
      if (v !== undefined && !DATE_PARTIAL.test(v) && !DATETIME_OFFSET.test(v))
        problems.push(`${where}: ${f} '${v}' has no offset and is not a date`);
    }
    const rec = field(front, "recorded");
    if (!rec || !DATETIME_OFFSET.test(rec)) problems.push(`${where}: recorded '${rec}' must carry an offset`);
    const itemId = field(front, "id");
    if (!itemId || !ULID.test(itemId)) problems.push(`${where}: id '${itemId}' is not a ULID`);
    for (const f of ["supersedes", "retracts"])
      for (const v of listField(front, f)) if (!ULID.test(v)) problems.push(`${where}: ${f} entry '${v}' is not a ULID`);

    // Ref spans.
    const refIds = [...narrative.matchAll(/<ref id="([^"]*)">/g)].map((m) => m[1]);
    const opens = (narrative.match(/<ref\b/g) ?? []).length;
    const closes = (narrative.match(/<\/ref>/g) ?? []).length;
    if (opens !== refIds.length || opens !== closes) problems.push(`${where}: malformed ref tags`);
    for (const id of new Set(refIds)) {
      if (!ID.test(id)) problems.push(`${where}: bad ref id '${id}'`);
      if (!(id in payload) && !(NARRATIVE_ONLY[source] ?? []).includes(id))
        problems.push(`${where}: ref '${id}' has no payload entry and is not a documented narrative-only span`);
    }
    for (const key of Object.keys(payload)) if (!ID.test(key)) problems.push(`${where}: bad entry id '${key}'`);

    // Type-check the payload.
    if (fence) {
      const url = field(front, "url") ?? "";
      const typeName = field(front, "type");
      const schemaFile = schemas.find((s) => url.endsWith("/" + s));
      if (!schemaFile || !typeName) { problems.push(`${where}: schema url/type not resolvable`); continue; }
      const sha = field(front, "sha256");
      const actual = createHash("sha256").update(readFileSync(join(schemaDir, schemaFile))).digest("hex");
      if (sha !== actual) problems.push(`${where}: schema.sha256 is not the hash of ${schemaFile} (run bun work/schema-hashes.ts)`);
      const schemaPath = join(schemaDir, schemaFile).replace(/\.d\.ts$/, "");
      const ts = join(work, `ex${n++}.ts`);
      writeFileSync(
        ts,
        `// ${where}\nimport type { ${typeName} } from ${JSON.stringify(schemaPath)};\n` +
          `export const payload: Record<string, ${typeName}> = ${fence[2]};\n`,
      );
      tsFiles.push(ts);
    }
  }
}

const tsc = spawnSync(
  "bunx",
  ["-p", "typescript@5.6.3", "tsc", "--strict", "--noEmit", "--target", "es2022", "--module", "esnext",
   "--moduleResolution", "bundler", "--typeRoots", work, ...tsFiles],
  { encoding: "utf8" },
);
if (tsc.status !== 0) problems.push(`tsc:\n${tsc.stdout}${tsc.stderr}`);

console.log(`${tsFiles.length} payloads type-checked; ${problems.length} problem(s).`);
for (const p of problems) console.log(" - " + p);
process.exit(problems.length ? 1 : 0);
