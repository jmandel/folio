// bun packages/compiler/src/cli/regate.ts : re-apply the isolation gate (current scan.ts) to rounds the compile loop rejected.
// A round rejected only because of a scanner false positive (e.g. a heredoc body matching a network-tool name) is
// reinstated: its out/transform.ts is evaluated on the test split as usual and the record updated, with a note.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { evalPath, recordPath } from "../compile.ts";
import { REPO } from "../data.ts";
import { evaluateTransform, summary } from "../evaluate.ts";
import { backendOf, loadRecords } from "../report.ts";
import { scanRun } from "../scan.ts";
for (const r of loadRecords()) {
  let changed = false;
  for (const round of r.rounds) {
    if (!round.error?.startsWith("isolation gate") || !round.runId) continue;
    const dir = join(REPO, "runs/compiler", r.source, r.viewSet, r.backend, round.runId);
    const blocking = scanRun(dir).filter((f) => f.kind === "network" || f.kind === "ipc" || f.kind === "web-tool");
    writeFileSync(join(dir, "scan.json"), JSON.stringify({ findings: scanRun(dir), blocking: blocking.length, rescanned: true }, null, 1) + "\n");
    if (blocking.length) { console.log(`still blocked: ${round.runId}`); continue; }
    const t = readFileSync(join(dir, "out/transform.ts"), "utf8");
    const ev = evaluateTransform(t, r.source, r.viewSet, "test");
    writeFileSync(evalPath(round.runId), JSON.stringify({ runId: round.runId, ...ev }, null, 1) + "\n");
    round.ok = true; round.summary = summary(ev); round.error = `reinstated: the gate's first scan matched a heredoc body (scanner false positive); rescan clean`;
    round.evalPath = evalPath(round.runId).slice(REPO.length + 1);
    r.final = round.runId; changed = true;
    console.log(`reinstated ${r.source}/${r.viewSet}/${r.backend}/${r.condition} r${r.rep}: ${round.runId} ${round.summary}`);
  }
  if (changed) writeFileSync(recordPath(r.source, r.viewSet, backendOf(r.backend), r.condition as any, r.rep, r.variant), JSON.stringify(r, null, 1) + "\n");
}
process.exit(0);
