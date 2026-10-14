// bun packages/compiler/src/cli/write-views.ts : views v3, written by a fresh sandboxed agent from work/views-v3/{brief.md,skeleton.d.ts} only.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { runAgent } from "../../../agent-runner/src/index.ts";
import { REPO } from "../data.ts";
import { sandboxWrap } from "../sandbox.ts";
const dir = join(REPO, "work/views-v3");
const brief = readFileSync(join(dir, "brief.md"), "utf8");
const r = await runAgent({ family: "compiler/views-v3", backend: "claude", model: "opus", prompt: brief, inputs: { "skeleton.d.ts": readFileSync(join(dir, "skeleton.d.ts"), "utf8") },
  expectFiles: ["views.d.ts"], allowedTools: ["Read", "Write", "Edit", "Bash"], extraArgs: ["--disallowedTools=WebFetch,WebSearch"], wrapCommand: sandboxWrap, timeoutMs: 30 * 60_000 }, { retries: 1 });
console.log(r.meta.runId, r.meta.ok, r.meta.error ?? "", r.meta.costUsd);
writeFileSync(join(dir, "views.d.ts"), r.outputs["views.d.ts"]);
writeFileSync(join(dir, "run.txt"), `views v3 written by run ${r.meta.runId} (claude opus, sandboxed; inputs: brief.md + skeleton.d.ts only)\n`);
process.exit(0);
