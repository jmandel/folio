// Aggregation behind `bun run score` (round 2): reads compile records and per-run evaluations, adds the
// prose-check contribution, US Core validation, end-to-end merged accuracy and the traps visible in the
// training samples, caches passing mappers by schema hash, and returns the data SCORECARD.md is written from.

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { BACKENDS, type CompileRecord, evalPath, readTransformOf, RESULTS } from "./compile.ts";
import { EVAL_AS_OF, itemsForPatient, patientById, patients, REPO, SOURCES, type Source, sourceKey, splitOf, trapIndex, truth } from "./data.ts";
import { type Eval, expectedWithItems, rowsFor } from "./evaluate.ts";
import { execute, stage } from "./exec.ts";
import { family, mergedExpected, trapsFor } from "./keys.ts";
import { mergeRows } from "./merge.ts";
import { compareFacts, proseSample } from "./prose.ts";
import { add, type Counts, normAnalyte, normDrug, prf, rowCounts, rowWrong, scoreRows, type View, VIEWS, zero } from "./score.ts";

const rel = (p: string) => p.slice(REPO.length + 1);
export const backendOf = (label: string) => Object.values(BACKENDS).find((b) => b.label === label)!;

export function loadRecords(): CompileRecord[] {
  const root = join(RESULTS, "compiles");
  const out: CompileRecord[] = [];
  const walk = (d: string) => { if (!existsSync(d)) return; for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (f.endsWith(".json")) out.push(JSON.parse(readFileSync(p, "utf8"))); } };
  walk(root);
  return out;
}

export function loadEval(runId: string): (Eval & { runId: string }) | undefined {
  const p = evalPath(runId);
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : undefined;
}

/** Traps the training samples show: fact-level traps of the facts in the sampled items, in that source. */
export function trapsInSamples(rec: CompileRecord): string[] {
  const out = new Set<string>();
  const s = sourceKey(rec.source);
  for (const x of rec.samples) {
    const [pid, file] = x.split("/");
    const p = patientById(pid);
    const it = truth().items.get(pid)!.find((i) => i.source === s && i.file === file);
    if (!it) continue;
    for (const t of trapsFor(trapIndex(p), s, it.facts)) out.add(t);
  }
  return [...out].sort((a, b) => +a.slice(1) - +b.slice(1));
}

// ─── Prose-check contribution on held-out items ───────────────────────────────────────────────────

export interface ProseContribution {
  proseRunId: string; items: number; facts: number; discrepancies: number; confirmed: number; falseAlarms: number;
  errorsInScope: number; errorsFlagged: number; examples: { item_id: string; kind: string; fact: unknown; confirmed: boolean }[];
}

const localDateOf = (iso: string) => { try { return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso)); } catch { return ""; } };
function sameThing(key: string, row: { view: string; key: string }): boolean {
  const [view, k] = [key.split(":")[0], key.split(":").slice(1).join(":")];
  if (row.view !== view) return false;
  if (view === "medications" || view === "allergies") { const a = normDrug(row.key).split(" "), b = k.split(" "); return a.every((w) => b.includes(w)) || b.every((w) => a.includes(w)); }
  if (view === "problems") return row.key === k;
  if (view === "labs") { const [an, d] = k.split("@"); const [ra, rt] = row.key.split("@"); return normAnalyte(ra) === an && localDateOf(rt) === d; }
  if (view === "vitals") return row.key.split("@")[1]?.slice(0, 10) === k;
  return false;
}

export async function proseContribution(transformTs: string, source: Source): Promise<ProseContribution> {
  const sample = await proseSample(source, "test", 40);
  const byP = new Map(patients().map((p) => [p.patient, p]));
  const runs = execute(stage(transformTs, "app"), sample.items.map((x) => ({ patient: x.patient, asOf: x.as_of, items: itemsForPatient(source, byP.get(x.patient)!) }))).runs;
  const c: ProseContribution = { proseRunId: sample.runId, items: sample.items.length, facts: 0, discrepancies: 0, confirmed: 0, falseAlarms: 0, errorsInScope: 0, errorsFlagged: 0, examples: [] };
  sample.items.forEach((pi, i) => {
    const r = runs[i];
    c.facts += pi.facts.length;
    if (!r || r.error) return;
    const exp = expectedWithItems(pi.patient, source, pi.as_of, "app");
    const sc = scoreRows(exp, r.rows);
    const ds = compareFacts(pi, r.rows);
    const mentioned = new Set(truth().items.get(pi.patient)!.find((it) => it.item.id === pi.item_id)?.facts ?? []);
    const wrongHere = sc.rows.filter((x) => rowWrong(x) && x.basis.some((b) => mentioned.has(b)));
    c.errorsInScope += wrongHere.length;
    c.errorsFlagged += wrongHere.filter((w) => ds.some((d) => sameThing(d.matchKey, w))).length;
    for (const d of ds) {
      let confirmed = sc.rows.some((x) => rowWrong(x) && sameThing(d.matchKey, x));
      if (!confirmed && d.kind === "ruled_out_reported") confirmed = sc.anti.some((a) => a.hit && a.row.view === "problems" && (a.row.fields as any).family === family(d.fact.icd10cm, d.fact.condition));
      c.discrepancies++;
      if (confirmed) c.confirmed++; else c.falseAlarms++;
      if (c.examples.length < 40) c.examples.push({ item_id: d.item_id, kind: d.kind, fact: d.fact, confirmed });
    }
  });
  return c;
}

// ─── End to end ───────────────────────────────────────────────────────────────────────────────────

export interface EndToEnd { label: string; runIds: Record<string, string>; patients: number; views: Record<string, { rows: number; wrongRows: number; extraRows: number; precision: number | null; recall: number | null }>; hero: Record<string, { rows: number; wrongRows: number; extraRows: number }> }

export function endToEnd(mappers: Record<Source, { runId: string; transform: string }>, label: string): EndToEnd {
  const test = patients().filter((p) => splitOf(p.patient) === "test");
  const runs: Record<string, Map<string, any>> = {};
  for (const s of SOURCES) {
    const pts = test.filter((p) => p.sources[s]);
    runs[s] = new Map(execute(stage(mappers[s].transform, "app"), pts.map((p) => ({ patient: p.patient, asOf: EVAL_AS_OF, items: itemsForPatient(s, p) }))).runs.map((r) => [r.patient, r]));
  }
  const acc: Record<string, Counts & { rows: number; wrongRows: number; extraRows: number }> = {};
  const hero: Record<string, { rows: number; wrongRows: number; extraRows: number }> = {};
  const get = (o: any, v: string) => (o[v] ??= { ...zero(), rows: 0, wrongRows: 0, extraRows: 0 });
  for (const p of test) {
    const parts = SOURCES.filter((s) => p.sources[s]).map((s) => ({ source: s, rows: runs[s].get(p.patient)?.rows ?? {}, items: itemsForPatient(s, p).map((i) => ({ id: i.id, effective: i.effective })) }));
    const merged = mergeRows(parts);
    const shown = { ...merged, medications: merged.medications.filter((m) => m.status === "active" || m.status === "held") };
    const keys = Object.fromEntries(["active-meds", "problems", "allergies", "lab-series", "vitals"].map((v) => [v, JSON.parse(readFileSync(join(REPO, "corpus/answers", p.patient, `${v}.json`), "utf8")).key]));
    const tp = patientById(p.patient);
    const sc = scoreRows(mergedExpected(tp, keys, trapIndex(tp)), shown);
    for (const r of sc.rows) {
      const o = get(acc, r.view); add(o, rowCounts(r)); o.rows++; if (rowWrong(r)) o.wrongRows++;
      if (p.patient === "hero") { const h = get(hero, r.view); h.rows++; if (rowWrong(r)) h.wrongRows++; }
    }
    for (const x of sc.extras) { const o = get(acc, x.view); o.fp += x.fp; o.extraRows++; if (p.patient === "hero") get(hero, x.view).extraRows++; }
  }
  return {
    label, runIds: Object.fromEntries(SOURCES.map((s) => [s, mappers[s].runId])), patients: test.length,
    views: Object.fromEntries(Object.entries(acc).map(([v, c]) => { const p = prf(c); return [v, { rows: c.rows, wrongRows: c.wrongRows, extraRows: c.extraRows, precision: p.precision, recall: p.recall }]; })),
    hero: Object.fromEntries(Object.entries(hero).map(([v, c]) => [v, { rows: c.rows, wrongRows: c.wrongRows, extraRows: c.extraRows }])),
  };
}

// ─── Mapper cache ─────────────────────────────────────────────────────────────────────────────────

/**
 * A mapper passes when it type-checks, ran on every held-out patient at every as-of date without throwing,
 * is deterministic and has no contract issues. Deployable mappers come from conditions a (full docs) and b;
 * never c, which saw key-based counterexamples, and never the types-only ablation. Per (schema, view set,
 * backend) the cache keeps b's final round if it passes, else the first passing run of a.
 */
export function cacheMappers(recs: CompileRecord[]): { path: string; runId: string; condition: string; rep: number }[] {
  const out: { path: string; runId: string; condition: string; rep: number }[] = [];
  const groups = new Map<string, CompileRecord[]>();
  for (const r of recs.filter((x) => x.variant === "full" && x.condition !== "c")) { const k = `${r.source}|${r.viewSet}|${r.backend}`; if (!groups.has(k)) groups.set(k, []); groups.get(k)!.push(r); }
  for (const [, rs] of groups) {
    const cand = [...rs.filter((r) => r.condition === "b"), ...rs.filter((r) => r.condition === "a").sort((a, b) => a.rep - b.rep)];
    for (const r of cand) {
      if (!r.final) continue;
      const ev = loadEval(r.final);
      if (!ev || !ev.tsc.ok || ev.runtime.patientErrors.length || !ev.deterministic || ev.contract.length || ev.execError) continue;
      const dir = join(REPO, "mappers", r.schemaSha256, r.viewSetHash, r.backend);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, "transform.ts"), readTransformOf(r.source, r.viewSet, backendOf(r.backend), r.final));
      writeFileSync(join(dir, "provenance.json"), JSON.stringify({
        source: r.source, schema_sha256: r.schemaSha256, view_set: r.viewSet, view_set_hash: r.viewSetHash, backend: r.backend, model: r.model, keys_sha256: r.keysSha256,
        chosen: { condition: r.condition, rep: r.rep, runId: r.final, eval: rel(evalPath(r.final)) },
        gates: { tsc: true, deterministic: true, runtime_errors: 0, contract_issues: 0, isolation_scan: "no network, IPC or web-tool calls" },
        held_out: { patients: ev.runtime.patients, as_of: ev.asOfDates, views: ev.views, ms_per_item: ev.runtime.msPerItem },
        samples_from_training_patients: r.samples,
        all_runs: rs.map((x) => ({ condition: x.condition, rep: x.rep, final: x.final, rounds: x.rounds.map((y) => y.runId).filter(Boolean) })),
      }, null, 1) + "\n");
      out.push({ path: rel(join(dir, "transform.ts")), runId: r.final, condition: r.condition, rep: r.rep });
      break;
    }
  }
  return out;
}

export { VIEWS, type View };
