// bun run prose [--patients hero,s01] [--limit N] [--backend claude|codex] [--model M]
//               [--concurrency 4] [--retries 2] [--sources northgate,riverside] [--tmux] [--dry-run]
//
// Fills narrative for prose-needing items, one agent call per (patient, source), through the agent
// runner. Resumable: items whose request is unchanged and already accepted in the ledger are skipped.
// Rewrites the corpus at the end (same as `bun run gen`).

import { appendFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { type BackendName, pool } from "../../../agent-runner/src/index.ts";
import { build, resolveNarratives, writeCorpus } from "../corpus.ts";
import { REPO } from "../item.ts";
import { batchesOf, ledgerNarrative, loadLedger, requestHash, runBatch, saveLedger } from "../prose.ts";

const { values } = parseArgs({
  options: {
    patients: { type: "string" }, limit: { type: "string" }, backend: { type: "string", default: "claude" }, model: { type: "string" },
    concurrency: { type: "string", default: "4" }, retries: { type: "string", default: "2" }, sources: { type: "string" },
    tmux: { type: "boolean", default: false }, "dry-run": { type: "boolean", default: false }, tag: { type: "string", default: "" },
  },
});
const backend = values.backend as BackendName;
const model = values.model ?? (backend === "claude" ? "sonnet" : undefined);

const b = build();
const ledger = loadLedger();
let chosen = b.patients;
if (values.patients) { const ids = values.patients.split(","); chosen = ids.map((id) => b.patients.find((p) => p.id === id)!).filter(Boolean); }
if (values.limit) chosen = chosen.slice(0, +values.limit);
const sources = values.sources?.split(",");

const work = chosen.flatMap((p) => batchesOf(p.id, b.items.get(p.id)!)).filter((x) => !sources || sources.includes(x.key.split("/")[1]))
  .map((x) => ({ ...x, reqs: x.reqs.filter((r) => ledgerNarrative(ledger, x.key, r) === undefined) })).filter((x) => x.reqs.length);

console.log(`${work.length} batches, ${work.reduce((a, x) => a + x.reqs.length, 0)} notes to write (backend ${backend}${model ? `, model ${model}` : ""})`);
if (values["dry-run"]) {
  for (const w of work) console.log(`  ${w.key}: ${w.reqs.length}`);
  process.exit(0);
}

const summaryPath = join(REPO, "runs", "prose", "summary.jsonl");
mkdirSync(join(REPO, "runs", "prose"), { recursive: true });
const t0 = Date.now();
let saving = Promise.resolve();
await pool(work, +values.concurrency!, async (w) => {
  const started = Date.now();
  const res = await runBatch({ batchKey: w.key, source: w.source, reqs: w.reqs, backend, model, retries: +values.retries!, tmux: values.tmux, log: (s) => console.log(s) });
  const entry = (ledger.batches[w.key] ??= { patient: w.key.split("/")[0], source: w.source, items: {}, runs: [] });
  for (const r of w.reqs) {
    const acc = res.accepted.get(r.key);
    if (acc) entry.items[r.key] = { run: acc.run, hash: requestHash(r) };
  }
  entry.runs.push(...res.runs);
  const line = {
    batch: w.key, tag: values.tag, backend, model, requested: w.reqs.length, accepted: res.accepted.size, attempts: res.runs.length,
    first_attempt_accepted: res.runs[0]?.accepted ?? 0, cost_usd: res.runs.reduce((a, r) => a + (r.costUsd ?? 0), 0),
    agent_ms: res.runs.reduce((a, r) => a + r.durationMs, 0), wall_ms: Date.now() - started, runs: res.runs.map((r) => r.run),
    failed: Object.fromEntries(res.failed),
  };
  appendFileSync(summaryPath, JSON.stringify(line) + "\n");
  saving = saving.then(() => saveLedger(ledger));
  await saving;
});
console.log(`prose done in ${((Date.now() - t0) / 1000).toFixed(0)}s; rewriting corpus`);
const b2 = build();
const counts = resolveNarratives(b2);
writeCorpus(b2, counts);
console.log("narratives:", counts);
