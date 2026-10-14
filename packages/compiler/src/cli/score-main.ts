// FOLIO_COHORT=main bun packages/compiler/src/cli/score-main.ts : secondary results on the main corpus (round 3).
// For every round-3 record: wrong-row rates on the main cohort's old test split at 2026-10-13, and the traps its training
// samples show. Writes results/stage3/secondary-main.json, read by `bun run score` (fresh cohort).
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { evalPath, readTransformOf, RESULTS } from "../compile.ts";
import { COHORT } from "../data.ts";
import { type Eval, evaluateTransform } from "../evaluate.ts";
import { backendOf, loadRecords, trapsInSamples } from "../report.ts";
if (COHORT !== "main") throw new Error("run with FOLIO_COHORT=main");
const out: any[] = [];
mkdirSync(join(RESULTS, "evals-main-test"), { recursive: true });
for (const r of loadRecords()) {
  if (!r.final) { out.push({ ...key(r), final: null }); continue; }
  const t = readTransformOf(r.source, r.viewSet, backendOf(r.backend), r.final);
  const ev: Eval = evaluateTransform(t, r.source, r.viewSet, "test", { dates: ["2026-10-13"] });
  writeFileSync(evalPath(r.final, "main-test"), JSON.stringify({ runId: r.final, ...ev }, null, 1) + "\n");
  // Dev split again (the cache gate), with the current key; the frozen-key dev evaluations are kept in evals-main-dev-frozen-*.
  let dev: Eval | undefined;
  if (r.viewSet === "app" && r.variant === "full") {
    dev = evaluateTransform(t, r.source, r.viewSet, "dev");
    writeFileSync(evalPath(r.final, "main-dev"), JSON.stringify({ runId: r.final, ...dev }, null, 1) + "\n");
  }
  out.push({ ...key(r), final: r.final, views: ev.byDate["2026-10-13"], devLatest: dev?.byDate[dev.asOfDates[dev.asOfDates.length - 1]], trapsInSamples: trapsInSamples(r) });
  console.log(r.source, r.viewSet, r.backend, r.variant, r.rep, "done");
}
function key(r: any) { return { source: r.source, viewSet: r.viewSet, backend: r.backend, condition: r.condition, variant: r.variant, rep: r.rep }; }
writeFileSync(join(RESULTS, "secondary-main.json"), JSON.stringify(out, null, 1) + "\n");
process.exit(0);
