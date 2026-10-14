// bun packages/compiler/src/cli/matrix.ts [--backends opus,codex,sonnet] [--sources ...] [--uscore opus,codex] [--conditions a,b,c] [--concurrency 6]
// Runs the compile matrix: per (backend, source) the app-view chain a -> b -> c, plus US Core (a) for the listed backends.
import { parseArgs } from "node:util";
import { pool } from "../../../agent-runner/src/index.ts";
import { BACKENDS, compileA, compileWithFeedback } from "../compile.ts";
import { SOURCES, type Source } from "../data.ts";

const { values } = parseArgs({ options: {
  backends: { type: "string", default: "opus,codex,sonnet" }, sources: { type: "string", default: SOURCES.join(",") },
  uscore: { type: "string", default: "opus,codex" }, conditions: { type: "string", default: "a,b,c" }, concurrency: { type: "string", default: "6" },
} });
const sources = values.sources!.split(",") as Source[];
const conds = values.conditions!.split(",");
const tasks: { name: string; fn: () => Promise<unknown> }[] = [];
for (const bk of values.backends!.split(",")) for (const s of sources) tasks.push({ name: `${bk}/${s}/app`, fn: async () => {
  const b = BACKENDS[bk];
  if (conds.includes("a")) await compileA(s, "app", b);
  if (conds.includes("b")) await compileWithFeedback(s, "app", b, "b");
  if (conds.includes("c")) await compileWithFeedback(s, "app", b, "c");
} });
for (const bk of values.uscore ? values.uscore.split(",") : []) for (const s of sources) tasks.push({ name: `${bk}/${s}/uscore`, fn: () => compileA(s, "uscore", BACKENDS[bk]) });
await pool(tasks, +values.concurrency!, async (t) => {
  try { await t.fn(); console.log(`DONE ${t.name}`); } catch (e) { console.log(`FAILED ${t.name}: ${(e as Error).stack}`); }
});
console.log("matrix finished");
