// bun packages/compiler/src/cli/revise-views.ts : one revision of views v3 by a fresh sandboxed agent: replace examples that use named drugs.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { runAgent } from "../../../agent-runner/src/index.ts";
import { REPO } from "../data.ts";
import { sandboxWrap } from "../sandbox.ts";
const dir = join(REPO, "work/views-v3");
const avoid = process.argv.slice(2);
const prompt = `\`in/views.d.ts\` is a documentation file; \`in/brief.md\` is the brief it was written from. Revise only the examples: any
example that mentions ${avoid.map((a) => `"${a}"`).join(" or ")} must use a different drug or condition from an unrelated area of medicine
(and keep the same point). Change nothing else: no type, field, value or rule may change. Write the result to \`out/views.d.ts\`.`;
const r = await runAgent({ family: "compiler/views-v3", backend: "claude", model: "opus", prompt, inputs: { "views.d.ts": readFileSync(join(dir, "views.d.ts"), "utf8"), "brief.md": readFileSync(join(dir, "brief.md"), "utf8") },
  expectFiles: ["views.d.ts"], allowedTools: ["Read", "Write", "Edit"], extraArgs: ["--disallowedTools=WebFetch,WebSearch"], wrapCommand: sandboxWrap, timeoutMs: 20 * 60_000 }, { retries: 1 });
console.log(r.meta.runId, r.meta.ok, r.meta.error ?? "", r.meta.costUsd);
writeFileSync(join(dir, "views.d.ts"), r.outputs["views.d.ts"]);
writeFileSync(join(dir, "run.txt"), readFileSync(join(dir, "run.txt"), "utf8") + `revised by run ${r.meta.runId}: examples using ${avoid.join(", ")} replaced (drugs that coincide with corpus cases; no other information given)\n`);
process.exit(0);
