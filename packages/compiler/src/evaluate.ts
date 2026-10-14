// The harness's independent checks on one compiled mapper: tsc, contract scan, execution on held-out
// patients at several as-of dates (with timing and a determinism re-run), and scoring against the
// per-source keys: per view, field-level precision/recall and row-level error rates; per trap, with the
// number of distinct patients.

import { VIEW_SETS, type ViewSet } from "../../views/src/index.ts";
import {
  itemsForPatient, patientById, patientsIn, type PatientRef, sourceKey, type Source, type Split, trapIndex, truth,
} from "./data.ts";
import { contractIssues, execute, type Job, stage, typecheck } from "./exec.ts";
import { checkUsCore, projectUsCore } from "./fhir.ts";
import { type Expected, expectedFor } from "./keys.ts";
import { add, type Counts, prf, rowCounts, rowWrong, type RowOutcome, scoreRows, type View, VIEWS, zero } from "./score.ts";

/** Scoring dates: early in most records, mid-history, and the end of the corpus. */
export const AS_OF_DATES = ["2023-06-30", "2025-03-31", "2026-10-13"];
/** Traps every lab or reading carries; reported apart from the judgment traps. */
export const VOLUME_TRAPS = ["T7", "T9", "T10", "T11", "T14", "T16"];

export interface WrongRow {
  patient: string; local: string; asOf: string; view: View; key: string; matched: boolean; duplicated: number;
  wrong: { field: string; expected: unknown; actual: unknown }[]; traps: string[]; modality: string; basis: string[]; items: string[]; evidence?: unknown;
}
export interface ViewScore { precision: number | null; recall: number | null; tp: number; fp: number; fn: number; rows: number; wrongRows: number; extraRows: number }
export interface TrapScore { facts: number; errors: number; patients: number; patientsWithError: number }
export interface Eval {
  source: Source; viewSet: ViewSet["name"]; split: Split; asOfDates: string[];
  tsc: { ok: boolean; output: string }; contract: string[]; deterministic?: boolean; execError?: string;
  runtime: { patients: number; items: number; ms: number; msPerItem: number; patientErrors: { patient: string; asOf: string; error: string }[] };
  /** Pooled over the as-of dates. */
  views: Record<View, ViewScore>;
  /** Per as-of date. */
  byDate: Record<string, Record<View, ViewScore>>;
  /** Field-level recall per field name, pooled: field -> { ok, total }. */
  fields: Record<string, { ok: number; total: number }>;
  byModality: Record<string, ReturnType<typeof prf>>;
  traps: Record<string, TrapScore>;
  anti: { trap: string; reason: string; patient: string; asOf: string; actual: unknown }[];
  wrongRows: WrongRow[];
  fhir?: { resources: number; conformant: number; problems: Record<string, number> };
}

/** Item ids (in this source) whose rendered content mentions any of the truth ids. */
export function itemIdsFor(patient: string, source: Source, basis: string[]): string[] {
  const s = sourceKey(source);
  return truth().items.get(patient)!.filter((it) => it.source === s && it.facts.some((f) => basis.includes(f))).map((it) => it.item.id);
}

export function stripForUsCore(e: Expected): Expected {
  return {
    ...e, problems: [], allergies: [], vitals: [], anti: e.anti.filter((a) => a.view === "medications" || a.view === "labs"),
    medications: e.medications.map((r) => ({ ...r, items: undefined, fields: { ...r.fields, status_since: undefined, stop_reason: undefined, scoreIngredient: false, patient_reported: undefined, otc: undefined, sensitivity: undefined } as typeof r.fields })),
    labs: e.labs.map((r) => ({ ...r, items: undefined })),
  };
}

export function rowsFor(viewSet: ViewSet["name"], out: unknown) {
  return viewSet === "uscore" ? projectUsCore(out) : (out as any);
}

/** Expected rows for one patient, source and date, with the items carrying each fact (for `evidence`). */
export function expectedWithItems(patient: string, source: Source, asOf: string, viewSet: ViewSet["name"]): Expected {
  const p = patientById(patient);
  const e = expectedFor(p, source, asOf, trapIndex(p));
  for (const v of VIEWS) for (const r of e[v] as any[]) r.items = itemIdsFor(patient, source, r.basis);
  return viewSet === "uscore" ? stripForUsCore(e) : e;
}

const emptyView = (): ViewScore => ({ precision: null, recall: null, tp: 0, fp: 0, fn: 0, rows: 0, wrongRows: 0, extraRows: 0 });

export function evaluateTransform(transformTs: string, source: Source, viewSet: ViewSet["name"], split: Split = "test", opts: { patients?: PatientRef[]; dates?: string[] } = {}): Eval {
  const dates = opts.dates ?? AS_OF_DATES;
  const dir = stage(transformTs, viewSet);
  const tsc = typecheck(dir);
  const contract = contractIssues(transformTs);
  const pts = opts.patients ?? patientsIn(source, split);
  const itemsBy = new Map(pts.map((p) => [p.patient, itemsForPatient(source, p)]));
  const jobs: Job[] = dates.flatMap((asOf) => pts.map((p) => ({ patient: p.patient, asOf, items: itemsBy.get(p.patient)! })));
  const ex = execute(dir, jobs, { determinism: true });
  const ev: Eval = {
    source, viewSet, split, asOfDates: dates, tsc, contract, deterministic: ex.deterministic, execError: ex.error,
    runtime: { patients: pts.length, items: 0, ms: 0, msPerItem: 0, patientErrors: [] },
    views: {} as Eval["views"], byDate: {}, fields: {}, byModality: {}, traps: {}, anti: [], wrongRows: [],
  };
  const pooled: Record<string, Counts & { rows: number; wrongRows: number; extraRows: number }> = {};
  const perDate: Record<string, typeof pooled> = {};
  const acc = (o: typeof pooled, v: string) => (o[v] ??= { ...zero(), rows: 0, wrongRows: 0, extraRows: 0 });
  const byMod: Record<string, Counts> = {};
  const trapPatients: Record<string, { all: Set<string>; err: Set<string> }> = {};
  const fhir = viewSet === "uscore" ? { resources: 0, conformant: 0, problems: {} as Record<string, number> } : undefined;
  for (const run of ex.runs) {
    ev.runtime.ms += run.ms; ev.runtime.items += run.items;
    const ref = pts.find((x) => x.patient === run.patient)!;
    const exp = expectedWithItems(run.patient, source, run.asOf, viewSet);
    const failed = !!run.error;
    if (failed) ev.runtime.patientErrors.push({ patient: run.patient, asOf: run.asOf, error: run.error! });
    if (fhir && !failed && run.asOf === dates[dates.length - 1]) {
      const c = checkUsCore(run.rows, ref.sources[source]!);
      fhir.resources += c.resources; fhir.conformant += c.conformant;
      for (const [k, n] of Object.entries(c.problems)) fhir.problems[k] = (fhir.problems[k] ?? 0) + n;
    }
    const sc = scoreRows(exp, failed ? undefined : rowsFor(viewSet, run.rows));
    const d = (perDate[run.asOf] ??= {});
    for (const r of sc.rows) {
      const c = rowCounts(r), wrong = rowWrong(r);
      for (const o of [acc(pooled, r.view), acc(d, r.view)]) { add(o, c); o.rows++; if (wrong) o.wrongRows++; }
      add((byMod[r.modality] ??= zero()), c);
      for (const f of r.fields) { const x = (ev.fields[`${r.view}.${f.field}`] ??= { ok: 0, total: 0 }); x.total++; if (f.ok && r.matched) x.ok++; }
      if (failed) continue;
      for (const t of r.traps) {
        const s = (ev.traps[t] ??= { facts: 0, errors: 0, patients: 0, patientsWithError: 0 }); s.facts++; if (wrong) s.errors++;
        const tp = (trapPatients[t] ??= { all: new Set(), err: new Set() }); tp.all.add(run.patient); if (wrong) tp.err.add(run.patient);
      }
      if (wrong && ev.wrongRows.length < 4000) ev.wrongRows.push(wrongRow(run.patient, ref.sources[source]!, run.asOf, source, r));
    }
    for (const x of sc.extras) for (const o of [acc(pooled, x.view), acc(d, x.view)]) { o.fp += x.fp; o.extraRows++; }
    if (!failed) for (const a of sc.anti) for (const t of a.row.traps) {
      const s = (ev.traps[t] ??= { facts: 0, errors: 0, patients: 0, patientsWithError: 0 }); s.facts++;
      const tp = (trapPatients[t] ??= { all: new Set(), err: new Set() }); tp.all.add(run.patient);
      if (a.hit) { s.errors++; tp.err.add(run.patient); ev.anti.push({ trap: t, reason: a.hit.reason, patient: run.patient, asOf: run.asOf, actual: a.hit.actual }); }
    }
  }
  const fin = (o: typeof pooled) => Object.fromEntries(VIEWS.map((v) => { const c = o[v]; if (!c) return [v, emptyView()]; const p = prf(c); return [v, { precision: p.precision, recall: p.recall, tp: c.tp, fp: c.fp, fn: c.fn, rows: c.rows, wrongRows: c.wrongRows, extraRows: c.extraRows }]; })) as Record<View, ViewScore>;
  ev.views = fin(pooled);
  for (const [k, o] of Object.entries(perDate)) ev.byDate[k] = fin(o);
  for (const [t, s] of Object.entries(ev.traps)) { s.patients = trapPatients[t]?.all.size ?? 0; s.patientsWithError = trapPatients[t]?.err.size ?? 0; }
  ev.runtime.msPerItem = ev.runtime.items ? ev.runtime.ms / ev.runtime.items : 0;
  ev.byModality = Object.fromEntries(Object.entries(byMod).map(([k, c]) => [k, prf(c)]));
  if (fhir) ev.fhir = fhir;
  return ev;
}

function wrongRow(patient: string, local: string, asOf: string, source: Source, r: RowOutcome): WrongRow {
  return {
    patient, local, asOf, view: r.view, key: r.key, matched: r.matched, duplicated: r.duplicated,
    wrong: r.fields.filter((f) => !f.ok).map((f) => ({ field: f.field, expected: f.expected, actual: f.actual })),
    traps: r.traps, modality: r.modality, basis: r.basis, items: itemIdsFor(patient, source, r.basis), evidence: r.evidence,
  };
}

/** Compact summary for logs: wrong-row rate per view. */
export function summary(ev: Eval) {
  const rate = (v: ViewScore) => (v.rows ? `${v.wrongRows}/${v.rows}${v.extraRows ? `+${v.extraRows}x` : ""}` : "–");
  return `tsc=${ev.tsc.ok ? "ok" : "FAIL"} det=${ev.deterministic} errors=${ev.runtime.patientErrors.length}${ev.execError ? ` EXEC: ${ev.execError.slice(0, 120)}` : ""} wrong rows: ` +
    VIEWS.map((v) => `${v.slice(0, 4)} ${rate(ev.views[v])}`).join(", ");
}

export { VIEW_SETS };
