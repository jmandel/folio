// Aggregation behind `bun run score`: reads the compile records and per-run evaluations, adds the
// prose-check contribution (on held-out test items) and end-to-end merged-chart accuracy, caches
// passing mappers by schema hash, and writes results/stage3/scorecard.json and SCORECARD.md.

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { BACKENDS, type CompileRecord, evalPath, readTransformOf, RESULTS } from "./compile.ts";
import { EVAL_AS_OF, itemsForPatient, patientById, patients, patientsIn, REPO, SOURCES, type Source, splitOf, trapIndex } from "./data.ts";
import { type Eval, evaluateTransform, rowsFor, stripForUsCore } from "./evaluate.ts";
import { execute, stage } from "./exec.ts";
import { expectedFor, family, mergedExpected } from "./keys.ts";
import { mergeRows } from "./merge.ts";
import { compareFacts, proseSample, PROSE_MODEL } from "./prose.ts";
import { add, type Counts, normAnalyte, normDrug, prf, rowCounts, rowWrong, scoreRows, VIEWS, zero } from "./score.ts";

const rel = (p: string) => p.slice(REPO.length + 1);
const backendOf = (label: string) => Object.values(BACKENDS).find((b) => b.label === label)!;

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

// ─── Prose-check contribution on held-out items ───────────────────────────────────────────────────

export interface ProseContribution {
  proseRunId: string; items: number; facts: number; discrepancies: number; confirmed: number; falseAlarms: number;
  /** Wrong expected rows about facts the sampled items mention, and how many of them a discrepancy pointed at. */
  errorsInScope: number; errorsFlagged: number;
  examples: { item_id: string; kind: string; fact: unknown; confirmed: boolean }[];
}

function sameThing(view: string, key: string, row: { view: string; key: string }): boolean {
  if (row.view !== view) return false;
  const [, k] = key.split(":");
  if (view === "medications" || view === "allergies") return normDrug(row.key).split(" ").every((w) => k.split(" ").includes(w)) || k.split(" ").every((w) => normDrug(row.key).split(" ").includes(w));
  if (view === "problems") return row.key === k;
  if (view === "labs") { const [a, d] = k.split("@"); const [ra, rt] = row.key.split("@"); return normAnalyte(ra) === a && localDateOf(rt) === d; }
  if (view === "vitals") return row.key.split("@")[1]?.slice(0, 10) === k;
  return false;
}
const localDateOf = (iso: string) => { try { return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(iso)); } catch { return ""; } };

export async function proseContribution(transformTs: string, source: Source, vs: "app" | "uscore"): Promise<ProseContribution> {
  const sample = await proseSample(source, "test", 40);
  const dir = stage(transformTs, vs);
  const byP = new Map(patients().map((p) => [p.patient, p]));
  const runs = execute(dir, sample.items.map((x) => ({ patient: x.patient, asOf: x.as_of, items: itemsForPatient(source, byP.get(x.patient)!) }))).runs;
  const c: ProseContribution = { proseRunId: sample.runId, items: sample.items.length, facts: 0, discrepancies: 0, confirmed: 0, falseAlarms: 0, errorsInScope: 0, errorsFlagged: 0, examples: [] };
  const { truth } = await import("./data.ts");
  sample.items.forEach((pi, i) => {
    const r = runs[i];
    c.facts += pi.facts.length;
    if (!r || r.error) return;
    const p = patientById(pi.patient);
    let exp = expectedFor(p, source, pi.as_of, trapIndex(p));
    if (vs === "uscore") exp = stripForUsCore(exp);
    const rows = rowsFor(vs, r.rows);
    const sc = scoreRows(exp, rows);
    const ds = compareFacts(pi, rows);
    const rendered = truth().items.get(pi.patient)!.find((it) => it.item.id === pi.item_id);
    const mentioned = new Set(rendered?.facts ?? []);
    const wrongHere = sc.rows.filter((x) => rowWrong(x) && x.basis.some((b) => mentioned.has(b)));
    c.errorsInScope += wrongHere.length;
    c.errorsFlagged += wrongHere.filter((w) => ds.some((d) => sameThing(d.matchKey.split(":")[0], d.matchKey, w))).length;
    for (const d of ds) {
      const view = d.matchKey.split(":")[0];
      let confirmed = sc.rows.some((x) => rowWrong(x) && sameThing(view, d.matchKey, x));
      if (!confirmed && d.kind === "ruled_out_reported") confirmed = sc.anti.some((a) => a.hit && a.row.view === "problems" && (a.row.fields as any).family === family(d.fact.icd10cm, d.fact.condition));
      if (!confirmed && view !== "error") confirmed = sc.extras.some((x) => x.view === view && view === "problems" && family((x.row as any).icd10cm, (x.row as any).condition) === d.matchKey.split(":")[1]);
      c.discrepancies++;
      if (confirmed) c.confirmed++; else c.falseAlarms++;
      if (c.examples.length < 40) c.examples.push({ item_id: d.item_id, kind: d.kind, fact: d.fact, confirmed });
    }
  });
  return c;
}

// ─── End to end ───────────────────────────────────────────────────────────────────────────────────

export interface EndToEnd { backend: string; condition: string; runIds: Record<string, string>; patients: number; counts: Record<string, ReturnType<typeof prf>>; hero: Record<string, ReturnType<typeof prf>>; heroWrong: unknown[]; traps: Record<string, { facts: number; errors: number }> }

export function endToEnd(mappers: Record<Source, { runId: string; transform: string }>, backend: string, condition: string): EndToEnd {
  const test = patients().filter((p) => splitOf(p.patient) === "test");
  const runs: Record<string, Map<string, any>> = {};
  for (const s of SOURCES) {
    const pts = test.filter((p) => p.sources[s]);
    const ex = execute(stage(mappers[s].transform, "app"), pts.map((p) => ({ patient: p.patient, asOf: EVAL_AS_OF, items: itemsForPatient(s, p) })));
    runs[s] = new Map(ex.runs.map((r) => [r.patient, r]));
  }
  const counts: Record<string, Counts> = Object.fromEntries([...VIEWS, "all"].map((v) => [v, zero()]));
  const hero: Record<string, Counts> = Object.fromEntries([...VIEWS, "all"].map((v) => [v, zero()]));
  const traps: EndToEnd["traps"] = {};
  const heroWrong: unknown[] = [];
  for (const p of test) {
    const parts = SOURCES.filter((s) => p.sources[s]).map((s) => ({ source: s, rows: runs[s].get(p.patient)?.rows ?? {}, items: itemsForPatient(s, p).map((i) => ({ id: i.id, effective: i.effective })) }));
    const merged = mergeRows(parts);
    const merged2 = { ...merged, medications: merged.medications.filter((m) => m.status === "active" || m.status === "held") };
    const keys = Object.fromEntries(["active-meds", "problems", "allergies", "lab-series", "vitals"].map((v) => [v, JSON.parse(readFileSync(join(REPO, "corpus/answers", p.patient, `${v}.json`), "utf8")).key]));
    const tp = patientById(p.patient);
    const sc = scoreRows(mergedExpected(tp, keys, trapIndex(tp)), merged2);
    for (const r of sc.rows) {
      const c = rowCounts(r);
      add(counts[r.view], c); add(counts.all, c);
      if (p.patient === "hero") { add(hero[r.view], c); add(hero.all, c); if (rowWrong(r)) heroWrong.push({ view: r.view, key: r.key, matched: r.matched, duplicated: r.duplicated, wrong: r.fields.filter((f) => !f.ok) }); }
      for (const t of r.traps) { const s = (traps[t] ??= { facts: 0, errors: 0 }); s.facts++; if (rowWrong(r)) s.errors++; }
    }
    for (const x of sc.extras) { counts[x.view].fp += x.fp; counts.all.fp += x.fp; if (p.patient === "hero") { hero[x.view].fp += x.fp; hero.all.fp += x.fp; heroWrong.push({ view: x.view, extra: x.row }); } }
  }
  return {
    backend, condition, runIds: Object.fromEntries(SOURCES.map((s) => [s, mappers[s].runId])), patients: test.length,
    counts: Object.fromEntries(Object.entries(counts).map(([k, c]) => [k, prf(c)])), hero: Object.fromEntries(Object.entries(hero).map(([k, c]) => [k, prf(c)])), heroWrong, traps,
  };
}

// ─── Mapper cache ─────────────────────────────────────────────────────────────────────────────────

/**
 * A mapper passes when it type-checks, ran on every held-out patient without throwing, is deterministic
 * and has no contract issues. Among passing deployable mappers (conditions a and b; never c, which saw
 * keys) the cache keeps the latest round of b, else a.
 */
export function cacheMappers(recs: CompileRecord[]): { path: string; runId: string; condition: string }[] {
  const out: { path: string; runId: string; condition: string }[] = [];
  const groups = new Map<string, CompileRecord[]>();
  for (const r of recs) { const k = `${r.source}|${r.viewSet}|${r.backend}`; if (!groups.has(k)) groups.set(k, []); groups.get(k)!.push(r); }
  for (const [, rs] of groups) {
    const cand = ["b", "a"].map((c) => rs.find((r) => r.condition === c)).filter(Boolean) as CompileRecord[];
    for (const r of cand) {
      if (!r.final) continue;
      const ev = loadEval(r.final);
      if (!ev || !ev.tsc.ok || ev.runtime.patientErrors.length || !ev.deterministic || ev.contract.length || ev.execError) continue;
      const dir = join(REPO, "mappers", r.schemaSha256, r.viewSetHash, r.backend);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, "transform.ts"), readTransformOf(r.source, r.viewSet, backendOf(r.backend), r.final));
      const all = Object.fromEntries(rs.map((x) => [x.condition, { final: x.final, rounds: x.rounds.map((y) => ({ runId: y.runId, summary: y.summary, costUsd: y.costUsd })) }]));
      writeFileSync(join(dir, "provenance.json"), JSON.stringify({
        source: r.source, schema_sha256: r.schemaSha256, view_set: r.viewSet, view_set_hash: r.viewSetHash, backend: r.backend, model: r.model,
        chosen: { condition: r.condition, runId: r.final, eval: rel(evalPath(r.final)) }, gates: { tsc: true, deterministic: true, runtime_errors: 0, contract_issues: 0 },
        held_out: { patients: ev.runtime.patients, precision: ev.counts.all.precision, recall: ev.counts.all.recall, ms_per_item: ev.runtime.msPerItem },
        samples_from_training_patients: r.samples, conditions: all,
      }, null, 1) + "\n");
      out.push({ path: rel(join(dir, "transform.ts")), runId: r.final, condition: r.condition });
      break;
    }
  }
  return out;
}

export { dirname, PROSE_MODEL, patientsIn, evaluateTransform };
