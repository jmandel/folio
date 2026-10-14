// bun run compile <source> [--backend opus|sonnet|codex] [--condition a|b|c] [--views app|uscore] [--force] [--workdir-only]
import { parseArgs } from "node:util";
import { BACKENDS, compileA, compileWithFeedback } from "../compile.ts";
import { SOURCES, type Source } from "../data.ts";
import { buildWorkdir } from "../workdir.ts";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: { backend: { type: "string", default: "opus" }, condition: { type: "string", default: "a" }, views: { type: "string", default: "app" }, force: { type: "boolean" }, "workdir-only": { type: "boolean" } },
});
const source = positionals[0] as Source;
if (!SOURCES.includes(source)) throw new Error(`usage: bun run compile <${SOURCES.join("|")}> [--backend opus|sonnet|codex] [--condition a|b|c] [--views app|uscore]`);
const b = BACKENDS[values.backend!];
if (!b) throw new Error(`unknown backend ${values.backend}`);
const vs = values.views as "app" | "uscore";
if (values["workdir-only"]) {
  const wd = buildWorkdir(source, vs);
  for (const [f, t] of Object.entries(wd.inputs)) console.log(`in/${f}  (${t.length} bytes)`);
  console.log("samples from training patients:", wd.sampleList.join(", "));
  process.exit(0);
}
const c = values.condition!;
const rec = c === "a" ? await compileA(source, vs, b, values.force) : await compileWithFeedback(source, vs, b, c as "b" | "c", values.force);
console.log(JSON.stringify(rec.rounds.map((r) => ({ round: r.round, runId: r.runId, ok: r.ok, cost: r.costUsd, summary: r.summary })), null, 1));
