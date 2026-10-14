// What the compiler agent sees: its whole world is the run dir's in/ folder, built here. It holds the
// source's schema, the consumer's view files, about eight sample items from training patients (Markdown
// form, plus the same items in JSON form for running), a harness stub, and the instructions. Nothing
// else: no answer keys, no truth, no TRAPS.md, no NOTES.md or README of the source, no other source.

import { basename } from "node:path";
import { VIEW_SETS, viewSetFiles, type ViewSet } from "../../views/src/index.ts";
import { schemaText, SCHEMA_FILE, selectSamples, type Source } from "./data.ts";

export interface Workdir { inputs: Record<string, string>; prompt: string; sampleList: string[] }

const HARNESS_TSCONFIG = (vs: ViewSet) => JSON.stringify({
  compilerOptions: {
    strict: true, noEmit: true, target: "ES2022", module: "ESNext", moduleResolution: "Bundler", types: [], lib: ["ES2022"],
    allowImportingTsExtensions: true, noUnusedLocals: false,
  },
  files: ["typecheck.ts"],
}, null, 2) + "\n" + (vs ? "" : "");

const TYPECHECK = (vs: ViewSet) => `// Type-checks out/transform.ts against the consumer's contract. Do not edit.
import { transform } from "../../out/transform.ts";
import type { ${vs.transformType} } from "../views/${vs.transformFile.replace(/\.d\.ts$/, "")}";
const check: ${vs.transformType} = transform;
export { check };
`;

const RUN = `// Runs out/transform.ts on the sample patients and prints the rows. Usage: bun in/harness/run.ts [asOf]
import { readFileSync } from "node:fs";
import { transform } from "../../out/transform.ts";
const groups: { patient: string; items: unknown[] }[] = JSON.parse(readFileSync(new URL("../samples/samples.json", import.meta.url), "utf8"));
const asOf = process.argv[2] ?? "2026-10-13";
for (const g of groups) console.log(JSON.stringify({ patient: g.patient, asOf, rows: (transform as (i: unknown[], a: string) => unknown)(g.items, asOf) }, null, 2));
`;

const CHECK_SH = `#!/bin/sh
# Type-check out/transform.ts (strict, no Node/Bun types), then run it on the samples.
set -e
cd "$(dirname "$0")/../.."
bun node_modules/typescript/lib/tsc.js -p in/harness/tsconfig.json
bun in/harness/run.ts "$@"
`;

export function instructions(source: Source, vs: ViewSet, nSamples: number, nPatients: number): string {
  const schemaName = basename(SCHEMA_FILE[source]);
  const target = vs.name === "app"
    ? "the consumer's app views in `in/views/views.d.ts`"
    : "US Core FHIR resources as defined in `in/views/uscore.d.ts` (which builds on the rules in `in/views/views.d.ts`)";
  return `# Write a mapper

You are writing a deterministic mapper from one source system's FOLIO record items into ${target}.

## What you have (all under \`in/\`)

- \`in/schema/${schemaName}\`: the source system's schema. This is the only documentation of the source.
  Its docstrings say what every field and code means; read all of it.
- \`in/views/\`: the target view definitions, written by the consumer. Their docstrings are the
  specification of the output: which rows to emit, which to leave out, units, statuses, time rules.
- \`in/samples/\`: ${nSamples} sample items from ${nPatients} patients of this source, in FOLIO Markdown form
  (frontmatter = envelope, then narrative, then the \`json payload\` block). \`in/samples/samples.json\` has
  the same items in JSON form, grouped by patient: that is the form your function receives.
- \`in/harness/\`: \`sh in/harness/check.sh [asOf]\` type-checks your mapper (strict, no Node/Bun types) and runs
  it on the sample patients, printing the rows.

## The task

Write \`out/transform.ts\` exporting

\`\`\`ts
export function transform(items: FolioItem[], asOf: string): ${vs.name === "app" ? "ViewRows" : "UsCoreRows"}
\`\`\`

(the type \`${vs.transformType}\` in \`in/views/${vs.transformFile}\`). It receives every item this source
published for ONE patient, in no particular order, including items that were later superseded or
retracted, and a local date \`asOf\` (\`YYYY-MM-DD\`). It returns the rows describing this source's record
as of the end of that day.

Your mapper will be run, unchanged, on many other patients of this source whose records contain
situations the samples do not show. Rely on the schema's documentation for those, not only on the
samples. Nobody will review the output by hand; a mapper that runs cleanly but reads a field wrongly
produces wrong clinical data.

## Rules

- \`out/transform.ts\` is self-contained TypeScript. Its only allowed import is
  \`import type { … } from "../in/views/${vs.name === "app" ? "views" : "uscore"}"\` (and \`"../in/views/views"\`). No other imports.
- Deterministic: no clock (\`Date.now()\`, \`new Date()\` without an argument), no randomness, no network, no
  file system, no environment. Parsing dates with \`Date.parse\`/\`new Date(string)\` and \`Intl\` time-zone
  formatting are fine.
- It must type-check (\`sh in/harness/check.sh\`) and must not throw on input it does not expect: skip
  what it cannot read.
- You may write and run your own tests or scratch scripts under \`out/\` with \`bun\`. Only
  \`out/transform.ts\` is used.

When you are done, reply with a few lines on the judgment calls you made.
`;
}

export function buildWorkdir(source: Source, viewSet: ViewSet["name"]): Workdir {
  const vs = VIEW_SETS[viewSet];
  const samples = selectSamples(source);
  const inputs: Record<string, string> = {};
  inputs[`schema/${basename(SCHEMA_FILE[source])}`] = schemaText(source);
  for (const [f, text] of Object.entries(viewSetFiles(vs))) inputs[`views/${f}`] = text;
  // Patients are named by their id at this source only.
  const groups = new Map<string, unknown[]>();
  samples.forEach((s, i) => {
    inputs[`samples/${String(i + 1).padStart(2, "0")}-${s.file}`] = s.markdown;
    const pid = s.item.patient;
    if (!groups.has(pid)) groups.set(pid, []);
    groups.get(pid)!.push(s.item);
  });
  inputs["samples/samples.json"] = JSON.stringify([...groups].map(([patient, items]) => ({ patient, items })), null, 2) + "\n";
  inputs["harness/tsconfig.json"] = HARNESS_TSCONFIG(vs);
  inputs["harness/typecheck.ts"] = TYPECHECK(vs);
  inputs["harness/run.ts"] = RUN;
  inputs["harness/check.sh"] = CHECK_SH;
  const prompt = instructions(source, vs, samples.length, groups.size);
  inputs["INSTRUCTIONS.md"] = prompt;
  return { inputs, prompt, sampleList: samples.map((s) => `${s.patient}/${s.file}`) };
}

export const HARNESS = { HARNESS_TSCONFIG, TYPECHECK };
