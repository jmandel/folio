// bun packages/compiler/src/cli/matrix.ts [--backends opus,codex,sonnet] [--sources ...] [--reps 3] [--uscore opus,codex]
//   [--ablation opus:northgate,riverside] [--conditions a,b,c] [--concurrency 8]
// Round 2 matrix: per (backend, source) condition a three times (independent runs), b and c once each (starting
// from a's first run); US Core (a, once) for the listed backends; the types-only documentation ablation (a, x reps).
import { parseArgs } from "node:util";
import { pool } from "../../../agent-runner/src/index.ts";
import { BACKENDS, compileA, compileWithFeedback } from "../compile.ts";
import { SOURCES, type Source } from "../data.ts";

const { values } = parseArgs({ options: {
  backends: { type: "string", default: "opus,codex,sonnet" }, sources: { type: "string", default: SOURCES.join(",") }, reps: { type: "string", default: "3" },
  uscore: { type: "string", default: "opus,codex" }, ablation: { type: "string", default: "opus:northgate,riverside" },
  conditions: { type: "string", default: "a,b,c" }, concurrency: { type: "string", default: "8" },
} });
const sources = values.sources!.split(",") as Source[];
const conds = values.conditions!.split(",");
const reps = +values.reps!;
const tasks: { name: string; fn: () => Promise<unknown> }[] = [];
for (const bk of values.backends!.split(",").filter(Boolean)) for (const s of sources) {
  tasks.push({ name: `${bk}/${s}/app/a-r1+b+c`, fn: async () => {
    if (conds.includes("a")) await compileA(s, "app", BACKENDS[bk], false, 1);
    if (conds.includes("b")) await compileWithFeedback(s, "app", BACKENDS[bk], "b");
    if (conds.includes("c")) await compileWithFeedback(s, "app", BACKENDS[bk], "c");
  } });
  if (conds.includes("a")) for (let r = 2; r <= reps; r++) tasks.push({ name: `${bk}/${s}/app/a-r${r}`, fn: () => compileA(s, "app", BACKENDS[bk], false, r) });
}
for (const bk of (values.uscore ?? "").split(",").filter(Boolean)) for (const s of sources) tasks.push({ name: `${bk}/${s}/uscore`, fn: () => compileA(s, "uscore", BACKENDS[bk], false, 1) });
for (const spec of (values.ablation ?? "").split(";").filter(Boolean)) {
  const [bk, list] = spec.split(":");
  for (const s of list.split(",") as Source[]) for (let r = 1; r <= reps; r++) tasks.push({ name: `${bk}/${s}/app/a-typesonly-r${r}`, fn: () => compileA(s, "app", BACKENDS[bk], false, r, "types-only") });
}
console.log(`${tasks.length} tasks`);
await pool(tasks, +values.concurrency!, async (t) => {
  try { await t.fn(); console.log(`DONE ${t.name}`); } catch (e) { console.log(`FAILED ${t.name}: ${(e as Error).stack}`); }
});
console.log("matrix finished");
process.exit(0);
