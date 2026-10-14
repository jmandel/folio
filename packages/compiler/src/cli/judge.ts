// bun packages/compiler/src/cli/judge.ts : an independent agent judges the three key changes made after triage in round 1.
// It sees source schemas, the consumer views (v1 and v2), truth model and generator excerpts, and the key rules before and
// after each change. It sees no mapper output and no scores. Verdicts: results/stage3/key-judge.json.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { runAgent } from "../../../agent-runner/src/index.ts";
import { REPO } from "../data.ts";
import { sandboxWrap } from "../sandbox.ts";
const J = process.argv[2];
const rd = (p: string) => readFileSync(p, "utf8");
const inputs: Record<string, string> = {
  "sources/homelog-v1.d.ts": rd(join(REPO, "sources/homelog/schema/homelog-v1.d.ts")),
  "sources/riverside-doc-v1.d.ts": rd(join(REPO, "sources/riverside/schema/riverside-doc-v1.d.ts")),
  "sources/northgate-chart-v1.d.ts": rd(join(REPO, "sources/northgate/schema/northgate-chart-v1.d.ts")),
  "sources/lakeview-v1.d.ts": rd(join(REPO, "sources/lakeview/schema/lakeview-v1.d.ts")),
  "views/views-v1.d.ts": rd(join(J, "views-v1.d.ts")),
  "views/views-v2.d.ts": rd(join(REPO, "packages/views/views.d.ts")),
  "truth/MODEL.md": rd(join(REPO, "truth/MODEL.md")),
  "truth/model.ts": rd(join(REPO, "packages/truth/src/model.ts")),
  "truth/generator-excerpts.ts": rd(join(J, "truth-excerpts.ts")),
  "keys/keys-before-changes.ts": rd(join(J, "keys-before.ts")),
  "keys/keys-after-changes.ts": rd(join(J, "keys-v1-after.ts")),
  "keys/keys-v2.ts": rd(join(REPO, "packages/compiler/src/keys.ts")),
};
const prompt = `# Judge three answer-key changes

An answer key says what a correct reader of ONE source system's records, alone, should conclude, in the terms of a
consumer's views. The key is computed from a synthetic clinical truth plus knowledge of how each source renders it.
Three key rules were changed after the first evaluation round. Judge each change on its merits, using only:

- the source's own documentation (\`in/sources/*.d.ts\`),
- the consumer views it was scored against (\`in/views/views-v1.d.ts\`; \`views-v2.d.ts\` is the revised version),
- the truth model and generator (\`in/truth/\`),
- the key code before and after (\`in/keys/keys-before-changes.ts\`, \`keys-after-changes.ts\`; \`keys-v2.ts\` is current).

The changes:

1. **One row per ingredient.** Before, the key could hold two medication rows with the same ingredient (two truth
   medications, e.g. a patient's list naming a drug twice); after, it keeps one row per ingredient, the most recent.
2. **HomeLog paused medicine.** Before, a My Medicines entry with \`status: "taking"\` and \`note: "doctor told me to stop
   for now"\` was expected as \`active\`; after, as \`held\`.
3. **Riverside drug-caused diagnosis.** Before, Riverside's allergy rows came only from its allergy list and T-code
   "Adverse effect of X" diagnoses; after (v1), a diagnosis such as "Euglycemic DKA, SGLT2 inhibitor-associated" or
   "Angioedema, ACE inhibitor-associated" also yields an allergy row whose substance is the specific drug (found from the
   truth), typed 'allergy' for angioedema and 'adverse_reaction' for DKA. In v2 the views state this rule explicitly
   (substance = the one drug of the class on the same document's home medication list, else the class as written) and
   replace 'type' with 'reaction_type' + 'mechanism'.

For each change, decide: was the AFTER rule justified by the documentation the mapper was given (views v1 + the source
schema)? Was the BEFORE rule? Is the v2 key rule (keys-v2.ts) a faithful implementation of views v2 for this point?
Name the exact docstring lines you rely on. Be strict: where the documentation leaves the point open, say "ambiguous"
and say what a mapper could reasonably have done instead.

Write \`out/verdicts.json\`:
\`{ "changes": [ { "change": 1|2|3, "before_justified": "yes"|"no"|"ambiguous", "after_justified": "yes"|"no"|"ambiguous",
"v2_rule_faithful": "yes"|"no"|"partly", "reasons": "...", "doc_citations": ["file:line or quoted text", ...],
"reasonable_alternative_readings": ["..."] } ] }\`, and \`out/verdicts.md\` with the same in prose.`;
const r = await runAgent({ family: "compiler/key-judge", backend: "claude", model: "opus", prompt, inputs, expectFiles: ["verdicts.json", "verdicts.md"],
  allowedTools: ["Read", "Write", "Glob", "Grep", "Bash"], extraArgs: ["--disallowedTools=WebFetch,WebSearch"], wrapCommand: sandboxWrap, timeoutMs: 30 * 60_000 }, { retries: 1 });
console.log(r.meta.runId, r.meta.ok, r.meta.error ?? "", r.meta.costUsd);
mkdirSync(join(REPO, "results/stage3"), { recursive: true });
writeFileSync(join(REPO, "results/stage3/key-judge.json"), JSON.stringify({ runId: r.meta.runId, ...JSON.parse(r.outputs["verdicts.json"]) }, null, 1) + "\n");
writeFileSync(join(REPO, "results/stage3/key-judge.md"), `Run \`${r.meta.runId}\` (claude opus). See packages/compiler/src/cli/judge.ts for what it was given.\n\n` + r.outputs["verdicts.md"]);
process.exit(0);
