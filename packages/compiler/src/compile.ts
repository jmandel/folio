// The compile loop for one (source, view set, backend/model, condition):
//   (a) one-shot: the agent writes transform.ts from schema + views + samples; no feedback.
//   (b) prose-check feedback: discrepancies between the mapper's rows and an independent reading of
//       dev-split narratives are fed back, at most 2 rounds.
//   (c) calibration upper bound (CHEATING, for calibration only): key-based counterexamples from the
//       dev split are fed back, at most 2 rounds. Never cached as a deployable mapper.
// Every agent run is recorded by agent-runner under runs/compiler/<source>/<viewset>/<backend-model>/;
// each round's evaluation on the held-out test split is saved under results/stage3/evals/<runId>.json,
// and the chain of rounds under results/stage3/compiles/<source>/<viewset>/<backend-model>/<condition>.json.

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { type BackendName, runAgent, type RunResult } from "../../agent-runner/src/index.ts";
import { VIEW_SETS, viewSetHash, type ViewSet } from "../../views/src/index.ts";
import { EVAL_AS_OF, itemsForPatient, loadItems, patientById, patientsIn, REPO, schemaHash, type Source, trapIndex, truth } from "./data.ts";
import { type Eval, evaluateTransform, rowsFor, stripForUsCore, summary } from "./evaluate.ts";
import { execute, stage } from "./exec.ts";
import { expectedFor } from "./keys.ts";
import { compareFacts, type Discrepancy, proseSample } from "./prose.ts";
import { codexDefaultModel, sandboxWrap } from "./sandbox.ts";
import { rowWrong, scoreRows } from "./score.ts";
import { buildWorkdir } from "./workdir.ts";

export type Condition = "a" | "b" | "c";
export const RESULTS = join(REPO, "results/stage3");
export const MAX_ROUNDS = 2;

export interface Backend { backend: BackendName; model?: string; label: string }
export const BACKENDS: Record<string, Backend> = {
  opus: { backend: "claude", model: "opus", label: "claude-opus" },
  sonnet: { backend: "claude", model: "sonnet", label: "claude-sonnet" },
  codex: { backend: "codex", label: `codex-${codexDefaultModel().model ?? "default"}` },
};

export interface Round { round: number; runId: string; ok: boolean; error?: string; costUsd?: number; durationMs: number; numTurns?: number; usage?: Record<string, number>; feedbackItems?: number; evalPath?: string; summary?: string }
export interface CompileRecord {
  source: Source; viewSet: ViewSet["name"]; backend: string; model?: string; condition: Condition;
  schemaSha256: string; viewSetHash: string; samples: string[]; rounds: Round[]; startedFrom?: string; final?: string;
  note?: string;
}

const family = (source: Source, vs: string, b: Backend) => `compiler/${source}/${vs}/${b.label}`;
export const recordPath = (source: Source, vs: string, b: Backend, c: Condition) => join(RESULTS, "compiles", source, vs, b.label, `${c}.json`);
export const evalPath = (runId: string) => join(RESULTS, "evals", `${runId}.json`);

function save(path: string, data: unknown) { mkdirSync(dirname(path), { recursive: true }); writeFileSync(path, JSON.stringify(data, null, 1) + "\n"); }

function evaluateAndSave(r: RunResult, source: Source, vs: ViewSet["name"]): { ev?: Eval; path?: string } {
  const t = r.outputs["transform.ts"];
  if (!t) return {};
  const ev = evaluateTransform(t, source, vs, "test");
  const path = evalPath(r.meta.runId);
  save(path, { runId: r.meta.runId, ...ev });
  return { ev, path };
}

function roundOf(i: number, r: RunResult, e: { ev?: Eval; path?: string }, feedbackItems?: number): Round {
  return {
    round: i, runId: r.meta.runId, ok: r.meta.ok, error: r.meta.error, costUsd: r.meta.costUsd, durationMs: r.meta.durationMs, numTurns: r.meta.numTurns,
    usage: r.meta.usage, feedbackItems, evalPath: e.path ? e.path.slice(REPO.length + 1) : undefined, summary: e.ev ? summary(e.ev) : undefined,
  };
}

async function agentRun(source: Source, vs: ViewSet["name"], b: Backend, prompt: string, inputs: Record<string, string>, tag: string): Promise<RunResult> {
  const t0 = Date.now();
  const r = await runAgent({
    family: family(source, vs, b), backend: b.backend, model: b.model, prompt, inputs, expectFiles: ["transform.ts"],
    allowedTools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"], wrapCommand: sandboxWrap, timeoutMs: 40 * 60_000,
  }, { retries: 1 });
  console.log(`[${source}/${vs}/${b.label}/${tag}] run ${r.meta.runId} ok=${r.meta.ok} ${((Date.now() - t0) / 1000).toFixed(0)}s cost=${r.meta.costUsd?.toFixed(2) ?? "n/a"} ${r.meta.error ?? ""}`);
  return r;
}

/** Condition (a), or reuse an existing (a) record. */
export async function compileA(source: Source, vs: ViewSet["name"], b: Backend, force = false): Promise<CompileRecord> {
  const path = recordPath(source, vs, b, "a");
  if (!force && existsSync(path)) return JSON.parse(readFileSync(path, "utf8"));
  const wd = buildWorkdir(source, vs);
  const rec: CompileRecord = { source, viewSet: vs, backend: b.label, model: b.model ?? codexDefaultModel().model, condition: "a", schemaSha256: schemaHash(source), viewSetHash: viewSetHash(VIEW_SETS[vs]), samples: wd.sampleList, rounds: [] };
  const r = await agentRun(source, vs, b, wd.prompt, wd.inputs, "a");
  const e = evaluateAndSave(r, source, vs);
  rec.rounds.push(roundOf(0, r, e));
  if (r.outputs["transform.ts"]) rec.final = r.meta.runId;
  console.log(`  eval: ${rec.rounds[0].summary ?? "no transform.ts"}`);
  save(path, rec);
  return rec;
}

function transformOf(_rec: CompileRecord, runId: string, source: Source, vs: string, b: Backend): Record<string, string> {
  const dir = join(REPO, "runs", family(source, vs as ViewSet["name"], b), runId, "out");
  const files: Record<string, string> = {};
  const walk = (d: string, rel = "") => {
    for (const f of readdirSync(d)) {
      const p = join(d, f), r = rel ? `${rel}/${f}` : f;
      if (statSync(p).isDirectory()) { if (f !== "node_modules") walk(p, r); }
      else if (/\.(ts|md|json)$/.test(f) && statSync(p).size < 400_000) files[r] = readFileSync(p, "utf8");
    }
  };
  walk(dir);
  return files;
}

// ─── Feedback builders ─────────────────────────────────────────────────────────────────────────────

/** Run a mapper over the dev split as of given dates. */
function runOnDev(transformTs: string, source: Source, vs: ViewSet["name"], jobsFor: { patient: string; asOf: string }[]) {
  const dir = stage(transformTs, vs);
  const byP = new Map(patientsIn(source, "dev").map((p) => [p.patient, p]));
  const jobs = jobsFor.map((j) => ({ ...j, items: itemsForPatient(source, byP.get(j.patient)!) }));
  return execute(dir, jobs).runs;
}

const md = (source: Source, local: string, itemId: string) => loadItems(source, local).find((l) => l.item.id === itemId);

export async function proseFeedback(transformTs: string, source: Source, vs: ViewSet["name"]): Promise<{ text: string; discrepancies: Discrepancy[] }> {
  const sample = await proseSample(source, "dev", 30);
  const runs = runOnDev(transformTs, source, vs, sample.items.map((x) => ({ patient: x.patient, asOf: x.as_of })));
  const ds: Discrepancy[] = [];
  sample.items.forEach((pi, i) => { const r = runs[i]; if (r && !r.error) ds.push(...compareFacts(pi, rowsFor(vs, r.rows))); else if (r?.error) ds.push({ patient: pi.patient, local: pi.local, item_id: pi.item_id, as_of: pi.as_of, fact: { view: "medications" }, kind: "missing", mapper: `transform threw: ${r.error}`, matchKey: "error" }); });
  if (!ds.length) return { text: "", discrepancies: [] };
  const lines = [
    "# Feedback from an independent prose check",
    "",
    "A separate reader looked only at the narrative text (with its ref spans) of some items from other patients of this",
    "source, wrote down the facts each narrative asserts, and compared them with what your mapper returned for that patient",
    `as of the item's date. ${ds.length} discrepancies are listed below, each with the item it came from (full Markdown).`,
    "The reader can be wrong (narratives mention plans, other organizations' decisions, or round numbers); the schema is",
    "the authority. For each one, decide whether your mapper misreads the data and fix the mapper where it does.",
    "",
  ];
  const shown = new Set<string>();
  for (const d of ds.slice(0, 30)) {
    lines.push(`## Patient ${d.local}, as of ${d.as_of}: ${d.kind}`, "", `- Narrative says (item ${d.item_id}${d.fact.ref ? `, ref \`${d.fact.ref}\`` : ""}): ${JSON.stringify({ ...d.fact, quote: undefined })}`);
    if (d.fact.quote) lines.push(`- Quote: "${d.fact.quote}"`);
    lines.push(`- Your mapper: ${d.mapper === undefined ? "no matching row" : JSON.stringify(d.mapper).slice(0, 600)}`, "");
    if (!shown.has(d.item_id) && shown.size < 12) {
      const m = md(source, d.local, d.item_id);
      if (m) { lines.push("<details><summary>item</summary>", "", "````markdown", m.markdown.trim(), "````", "</details>", ""); shown.add(d.item_id); }
    }
  }
  return { text: lines.join("\n"), discrepancies: ds };
}

/** Condition (c): counterexamples from the per-source keys on dev patients. Calibration only. */
export function keyFeedback(transformTs: string, source: Source, vs: ViewSet["name"]): { text: string; n: number } {
  const dev = patientsIn(source, "dev");
  const runs = runOnDev(transformTs, source, vs, dev.map((p) => ({ patient: p.patient, asOf: EVAL_AS_OF })));
  const wrong: { local: string; patient: string; view: string; key: string; detail: string; items: string[]; sig: string }[] = [];
  for (const r of runs) {
    const p = patientById(r.patient);
    let exp = expectedFor(p, source, r.asOf, trapIndex(p));
    if (vs === "uscore") exp = stripForUsCore(exp);
    const local = dev.find((x) => x.patient === r.patient)!.sources[source]!;
    if (r.error) { wrong.push({ local, patient: r.patient, view: "-", key: "-", detail: `transform threw: ${r.error.slice(0, 300)}`, items: [], sig: "error" }); continue; }
    const sc = scoreRows(exp, rowsFor(vs, r.rows));
    for (const row of sc.rows) if (rowWrong(row)) {
      const ids = truth().items.get(r.patient)!.filter((it) => it.dir === source && it.facts.some((f) => row.basis.includes(f))).map((it) => it.item.id);
      const detail = !row.matched ? "expected a row, mapper has none" : row.duplicated ? `mapper emitted ${row.duplicated + 1} rows for it` :
        row.fields.filter((f) => !f.ok).map((f) => `${f.field}: expected ${JSON.stringify(f.expected)}, got ${JSON.stringify(f.actual)}`).join("; ");
      wrong.push({ local, patient: r.patient, view: row.view, key: row.key, detail, items: ids, sig: `${row.view}|${!row.matched ? "missing" : row.fields.filter((f) => !f.ok).map((f) => f.field).join(",")}` });
    }
    for (const x of sc.extras) wrong.push({ local, patient: r.patient, view: x.view, key: JSON.stringify(x.row).slice(0, 200), detail: "mapper row with no counterpart in the expected output", items: ((x.row as any)?.evidence ?? []).map((e: any) => e.item_id), sig: `${x.view}|extra` });
  }
  if (!wrong.length) return { text: "", n: 0 };
  // Diverse selection: round-robin over error signatures.
  const bySig = new Map<string, typeof wrong>();
  for (const w of wrong) { if (!bySig.has(w.sig)) bySig.set(w.sig, []); bySig.get(w.sig)!.push(w); }
  const picked: typeof wrong = [];
  const qs = [...bySig.values()];
  for (let i = 0; picked.length < 20 && qs.some((q) => q.length); i = (i + 1) % qs.length) if (qs[i].length) picked.push(qs[i].shift()!);
  const lines = [
    "# Feedback: counterexamples from expected outputs",
    "",
    `Your mapper was run on other patients of this source and compared with the expected output. ${wrong.length} rows were wrong`,
    "in total; a varied selection follows, with the items involved (full Markdown). Fix the mapper so it reads the data",
    "correctly in general, not only for these patients.",
    "",
  ];
  const shown = new Set<string>();
  for (const w of picked) {
    lines.push(`## Patient ${w.local}, ${w.view} \`${w.key}\``, "", `- ${w.detail}`, "");
    for (const id of w.items.slice(0, 2)) {
      if (shown.has(id) || shown.size >= 12) continue;
      const m = md(source, w.local, id);
      if (m) { lines.push("<details><summary>item</summary>", "", "````markdown", m.markdown.trim(), "````", "</details>", ""); shown.add(id); }
    }
  }
  return { text: lines.join("\n"), n: wrong.length };
}

const REVISE = (kind: "b" | "c") => `

## Revision round

Your earlier mapper is in \`in/previous/transform.ts\` (with any tests you wrote next to it). It was run on
other patients of this source, and ${kind === "b"
  ? "an independent check compared its output with what the items' narrative text says"
  : "its output was compared with expected outputs"}. The findings are in \`in/feedback.md\`. Revise the mapper
and write the complete new version to \`out/transform.ts\`. The rules above still apply.
`;

/** Conditions (b) and (c): start from the (a) mapper and feed back at most MAX_ROUNDS times. */
export async function compileWithFeedback(source: Source, vs: ViewSet["name"], b: Backend, cond: "b" | "c", force = false): Promise<CompileRecord> {
  const path = recordPath(source, vs, b, cond);
  if (!force && existsSync(path)) return JSON.parse(readFileSync(path, "utf8"));
  const a = await compileA(source, vs, b);
  const rec: CompileRecord = { ...a, condition: cond, rounds: [], startedFrom: a.final, final: a.final,
    note: cond === "c" ? "CALIBRATION ONLY: key-based counterexamples from the dev split were fed back (cheating-for-calibration upper bound)." : "Prose-check discrepancies on dev-split items fed back." };
  if (!a.final) { save(path, rec); return rec; }
  const wd = buildWorkdir(source, vs);
  let prevRun = a.final;
  for (let round = 1; round <= MAX_ROUNDS; round++) {
    const prevFiles = transformOf(rec, prevRun, source, vs, b);
    const t = prevFiles["transform.ts"];
    const fb = cond === "b" ? await proseFeedback(t, source, vs) : keyFeedback(t, source, vs);
    const n = cond === "b" ? (fb as { discrepancies: Discrepancy[] }).discrepancies.length : (fb as { n: number }).n;
    console.log(`[${source}/${vs}/${b.label}/${cond}] round ${round}: ${n} findings on dev`);
    if (!n) { rec.rounds.push({ round, runId: "", ok: true, durationMs: 0, feedbackItems: 0, summary: "no findings; stopped" }); break; }
    const inputs: Record<string, string> = { ...wd.inputs, "feedback.md": fb.text };
    for (const [f, text] of Object.entries(prevFiles)) inputs[`previous/${f}`] = text;
    const r = await agentRun(source, vs, b, wd.prompt + REVISE(cond), inputs, `${cond}${round}`);
    const e = evaluateAndSave(r, source, vs);
    rec.rounds.push(roundOf(round, r, e, n));
    console.log(`  eval: ${rec.rounds[rec.rounds.length - 1].summary ?? "no transform.ts"}`);
    if (!r.outputs["transform.ts"]) break;
    prevRun = r.meta.runId;
    rec.final = r.meta.runId;
    save(path, rec);
  }
  save(path, rec);
  return rec;
}

export function readTransformOf(source: Source, vs: string, b: Backend, runId: string): string {
  return readFileSync(join(REPO, "runs", family(source, vs as ViewSet["name"], b), runId, "out/transform.ts"), "utf8");
}
