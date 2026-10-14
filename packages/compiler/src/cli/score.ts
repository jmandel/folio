// bun run score [--no-prose] : aggregate every compile record into results/stage3/scorecard.json and SCORECARD.md.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";
import { BACKENDS, type CompileRecord, evalPath, readTransformOf, RESULTS } from "../compile.ts";
import { evaluateTransform } from "../evaluate.ts";
import { REPO, SOURCES, type Source } from "../data.ts";
import { cacheMappers, endToEnd, loadEval, loadRecords, proseContribution } from "../report.ts";
import { VIEWS } from "../score.ts";

const { values } = parseArgs({ options: { "no-prose": { type: "boolean" }, "no-reeval": { type: "boolean" } } });
const recs = loadRecords().sort((a, b) => `${a.source}${a.viewSet}${a.backend}${a.condition}`.localeCompare(`${b.source}${b.viewSet}${b.backend}${b.condition}`));
const backendOf = (label: string) => Object.values(BACKENDS).find((b) => b.label === label)!;

// Re-evaluate every round's mapper with the current keys and scorer, so all numbers are on one footing.
if (!values["no-reeval"]) {
  const done = new Set<string>();
  for (const r of recs) for (const round of r.rounds) {
    if (!round.runId || done.has(round.runId)) continue;
    done.add(round.runId);
    let t: string;
    try { t = readTransformOf(r.source, r.viewSet, backendOf(r.backend), round.runId); } catch { continue; }
    const ev = evaluateTransform(t, r.source, r.viewSet, "test");
    writeFileSync(evalPath(round.runId), JSON.stringify({ runId: round.runId, ...ev }, null, 1) + "\n");
  }
  console.log(`re-evaluated ${done.size} mapper runs`);
}
const pct = (x: number | null | undefined) => (x === null || x === undefined ? "–" : `${(100 * x).toFixed(1)}`);
const TRAP_NAMES: Record<string, { name: string }> = JSON.parse(readFileSync(join(REPO, "corpus/MANIFEST.json"), "utf8")).traps;

interface Cell {
  source: Source; viewSet: string; backend: string; model?: string; condition: string; runIds: string[]; finalRunId?: string;
  compiled: boolean; tsc?: boolean; runtimeErrors?: number; deterministic?: boolean; contract?: string[];
  precision?: number | null; recall?: number | null; views?: Record<string, { precision: number | null; recall: number | null }>;
  byModality?: Record<string, { precision: number | null; recall: number | null }>; traps?: Record<string, { facts: number; errors: number }>;
  msPerItem?: number; costUsd: number; agentMinutes: number; rounds: { runId: string; feedbackItems?: number; recall?: number | null; precision?: number | null }[];
  fhir?: { resources: number; conformant: number }; prose?: Awaited<ReturnType<typeof proseContribution>>;
}

const cells: Cell[] = [];
for (const r of recs) {
  const ev = r.final ? loadEval(r.final) : undefined;
  const cell: Cell = {
    source: r.source, viewSet: r.viewSet, backend: r.backend, model: r.model, condition: r.condition,
    runIds: r.rounds.map((x) => x.runId).filter(Boolean), finalRunId: r.final, compiled: !!ev?.tsc.ok,
    costUsd: r.rounds.reduce((a, x) => a + (x.costUsd ?? 0), 0), agentMinutes: r.rounds.reduce((a, x) => a + x.durationMs, 0) / 60000,
    rounds: r.rounds.filter((x) => x.runId).map((x) => { const e = loadEval(x.runId); return { runId: x.runId, feedbackItems: x.feedbackItems, recall: e?.counts.all.recall, precision: e?.counts.all.precision }; }),
  };
  if (ev) Object.assign(cell, {
    tsc: ev.tsc.ok, runtimeErrors: ev.runtime.patientErrors.length + (ev.execError ? ev.runtime.patients : 0), deterministic: ev.deterministic, contract: ev.contract,
    precision: ev.counts.all.precision, recall: ev.counts.all.recall,
    views: Object.fromEntries(VIEWS.map((v) => [v, { precision: ev.counts[v].precision, recall: ev.counts[v].recall }])),
    byModality: Object.fromEntries(Object.entries(ev.byModality).map(([k, v]) => [k, { precision: v.precision, recall: v.recall }])),
    traps: ev.traps, msPerItem: ev.runtime.msPerItem, fhir: ev.fhir ? { resources: ev.fhir.resources, conformant: ev.fhir.conformant } : undefined,
  });
  if (!values["no-prose"] && ev && r.viewSet === "app" && r.condition !== "c" && r.final) {
    cell.prose = await proseContribution(readTransformOf(r.source, r.viewSet, backendOf(r.backend), r.final), r.source, "app");
  }
  cells.push(cell);
  console.log(`${r.source}/${r.viewSet}/${r.backend}/${r.condition}: P=${pct(cell.precision)} R=${pct(cell.recall)}`);
}

// End to end: per backend and condition with app mappers for all four sources.
const e2e = [];
for (const b of [...new Set(recs.map((r) => r.backend))]) for (const c of ["a", "b", "c"]) {
  const finals = Object.fromEntries(SOURCES.map((s) => [s, recs.find((r) => r.source === s && r.viewSet === "app" && r.backend === b && r.condition === c)?.final]));
  if (SOURCES.some((s) => !finals[s] || !loadEval(finals[s]!)?.tsc.ok)) continue;
  const mappers = Object.fromEntries(SOURCES.map((s) => [s, { runId: finals[s]!, transform: readTransformOf(s, "app", backendOf(b), finals[s]!) }])) as Record<Source, { runId: string; transform: string }>;
  e2e.push(endToEnd(mappers, b, c));
  console.log(`end-to-end ${b}/${c} done`);
}

const cached = cacheMappers(recs);
const prior = existsSync(join(RESULTS, "scorecard.json")) ? JSON.parse(readFileSync(join(RESULTS, "scorecard.json"), "utf8")) : {};
const scorecard = { generated_from: "results/stage3/compiles/**, results/stage3/evals/<runId>.json", as_of: "2026-10-13", split: "test (held out)", cells, end_to_end: e2e, cached, notes: prior.notes };
mkdirSync(RESULTS, { recursive: true });
writeFileSync(join(RESULTS, "scorecard.json"), JSON.stringify(scorecard, null, 1) + "\n");

// ─── SCORECARD.md ────────────────────────────────────────────────────────────────────────────────
const L: string[] = [];
const cond = (c: string) => ({ a: "a one-shot", b: "b prose feedback", c: "c key feedback (calibration)" } as Record<string, string>)[c];
L.push("# Stage 3 scorecard", "", "Generated by `bun run score` from the compile records in `results/stage3/compiles/` and the per-run evaluations in",
  "`results/stage3/evals/<runId>.json`. Every number is computed on the held-out test split of patients, as of 2026-10-13, against the",
  "per-source expected views (what a correct reader of that source alone should conclude). Run ids name directories under `runs/compiler/`.",
  "Condition c fed key-based counterexamples back to the agent: it is a calibration upper bound, not a deployable result.", "");
L.push("## Mappers", "", "Field-level precision and recall (presence of each expected row plus each scored field). Compiled = type-checks and runs.", "",
  "| Source | Views | Backend | Condition | Final run | Compiled | Runtime errors | Precision | Recall | Meds R | Problems R | Allergies R | Labs R | Vitals R | ms/item | Cost USD | Agent min |",
  "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|");
for (const c of cells) L.push(`| ${c.source} | ${c.viewSet} | ${c.backend} | ${cond(c.condition)} | \`${c.finalRunId ?? "–"}\` | ${c.compiled ? "yes" : "no"} | ${c.runtimeErrors ?? "–"} | ${pct(c.precision)} | ${pct(c.recall)} | ${VIEWS.map((v) => pct(c.views?.[v]?.recall)).join(" | ")} | ${c.msPerItem?.toFixed(3) ?? "–"} | ${c.costUsd ? c.costUsd.toFixed(2) : "n/a"} | ${c.agentMinutes.toFixed(1)} |`);
L.push("", "Cost is what the claude CLI reports per run; codex reports no cost. Rounds of conditions b and c (test-split recall after each round):", "");
for (const c of cells.filter((x) => x.condition !== "a")) L.push(`- ${c.source}/${c.viewSet}/${c.backend}/${c.condition}: ` + c.rounds.map((r) => `\`${r.runId}\` (${r.feedbackItems} findings fed back) R=${pct(r.recall)} P=${pct(r.precision)}`).join(" → "));

const traps = [...new Set(cells.flatMap((c) => Object.keys(c.traps ?? {})))].sort((a, b) => +a.slice(1) - +b.slice(1));
L.push("", "## Silent-error rate per trap", "", "Share of trap-bearing facts (expected rows, plus facts that must not appear) that a mapper which compiled and ran got wrong. `errors/facts`.", "");
for (const vs of ["app", "uscore"]) {
  const cs = cells.filter((c) => c.viewSet === vs && c.traps);
  if (!cs.length) continue;
  L.push(`### ${vs} views`, "", `| Trap | ${cs.map((c) => `${c.source.slice(0, 5)} ${c.backend.replace("claude-", "")} ${c.condition}`).join(" | ")} |`, `|---|${cs.map(() => "---").join("|")}|`);
  for (const t of traps) L.push(`| ${t} ${TRAP_NAMES[t]?.name ?? ""} | ${cs.map((c) => { const x = c.traps?.[t]; return x ? `${x.errors}/${x.facts}` : ""; }).join(" | ")} |`);
  L.push("");
}
L.push("## Structured-only vs narrated facts", "", "Recall by whether the source narrates the fact (truth visibility for that source). Unmatched mapper output cannot be split this way.", "",
  "| Source | Views | Backend | Condition | Structured-only R | Narrated R |", "|---|---|---|---|---|---|");
for (const c of cells.filter((x) => x.byModality)) L.push(`| ${c.source} | ${c.viewSet} | ${c.backend} | ${c.condition} | ${pct(c.byModality!.structured?.recall)} | ${pct(c.byModality!.narrated?.recall)} |`);
L.push("", "## Prose cross-check on held-out items", "", "An independent agent (claude sonnet) read only the narratives (with ref spans) of 40 sampled narrated test items per source and stated their facts;",
  "the harness compared them with each mapper's rows as of the item's date. Confirmed = the per-source key agrees the mapper row is wrong.",
  "Errors in scope = wrong expected rows about facts those items mention; flagged = pointed at by a discrepancy.", "",
  "| Source | Backend | Condition | Prose run | Facts read | Discrepancies | Confirmed | False alarms | Errors in scope | Flagged |", "|---|---|---|---|---|---|---|---|---|---|");
for (const c of cells.filter((x) => x.prose)) L.push(`| ${c.source} | ${c.backend} | ${c.condition} | \`${c.prose!.proseRunId}\` | ${c.prose!.facts} | ${c.prose!.discrepancies} | ${c.prose!.confirmed} | ${c.prose!.falseAlarms} | ${c.prose!.errorsInScope} | ${c.prose!.errorsFlagged} |`);
if (e2e.length) {
  L.push("", "## End to end: merged chart", "", "Each source's mapper runs on its own items; the generic merge (`packages/compiler/src/merge.ts`) combines the rows; the result is scored",
    "against the merged answer key from the truth (active and held medications, problems, allergies, all lab results, vitals). eGFR rows are",
    "compared with the value as reported under the views' eGFR rule.", "",
    "| Backend | Condition | Mapper runs (northgate, lakeview, riverside, homelog) | Patients | Precision | Recall | Meds R | Problems R | Allergies R | Labs R | Vitals R | Hero P | Hero R |", "|---|---|---|---|---|---|---|---|---|---|---|---|---|");
  for (const e of e2e) L.push(`| ${e.backend} | ${e.condition} | ${SOURCES.map((s) => `\`${e.runIds[s]}\``).join(", ")} | ${e.patients} | ${pct(e.counts.all.precision)} | ${pct(e.counts.all.recall)} | ${VIEWS.map((v) => pct(e.counts[v].recall)).join(" | ")} | ${pct(e.hero.all.precision)} | ${pct(e.hero.all.recall)} |`);
}
L.push("", "## Cached mappers", "", "Passing (type-checks, no runtime errors on held-out patients, deterministic, no contract issues) deployable mappers (condition b, else a):", "");
for (const c of cached) L.push(`- \`${c.path}\` (run \`${c.runId}\`, condition ${c.condition})`);
writeFileSync(join(RESULTS, "SCORECARD.md"), L.join("\n") + "\n");
console.log(`wrote ${join(RESULTS, "SCORECARD.md")}`);
export type { CompileRecord };
