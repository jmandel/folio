// The harness's independent checks on one compiled mapper: tsc, contract scan, execution on held-out
// patients (with timing and a determinism re-run), and field-level scoring against the per-source keys.

import { VIEW_SETS, type ViewSet } from "../../views/src/index.ts";
import {
  EVAL_AS_OF, itemsForPatient, patientById, patientsIn, type PatientRef, sourceKey, type Source, type Split, trapIndex, truth,
} from "./data.ts";
import { contractIssues, execute, type Job, stage, typecheck } from "./exec.ts";
import { checkUsCore, projectUsCore } from "./fhir.ts";
import { type Expected, expectedFor } from "./keys.ts";
import { add, type Counts, prf, rowCounts, rowWrong, type RowOutcome, scoreRows, type View, VIEWS, zero } from "./score.ts";

export interface WrongRow {
  patient: string; local: string; view: View; key: string; matched: boolean; duplicated: number;
  wrong: { field: string; expected: unknown; actual: unknown }[]; traps: string[]; modality: string; basis: string[]; items: string[]; evidence?: unknown;
}
export interface Eval {
  source: Source; viewSet: ViewSet["name"]; split: Split; asOf: string;
  tsc: { ok: boolean; output: string }; contract: string[]; deterministic?: boolean; execError?: string;
  runtime: { patients: number; items: number; ms: number; msPerItem: number; patientErrors: { patient: string; error: string }[] };
  counts: Record<View | "all", ReturnType<typeof prf>>;
  byModality: Record<string, ReturnType<typeof prf>>;
  traps: Record<string, { facts: number; errors: number }>;
  anti: { trap: string; reason: string; patient: string; actual: unknown }[];
  extras: Record<View, number>;
  wrongRows: WrongRow[];
  fhir?: { resources: number; conformant: number; problems: Record<string, number> };
}

/** Item ids (in this source) whose rendered content mentions any of the truth ids. */
function itemIdsFor(patient: string, source: Source, basis: string[]): string[] {
  const s = sourceKey(source);
  return truth().items.get(patient)!.filter((it) => it.source === s && it.facts.some((f) => basis.includes(f))).map((it) => it.item.id);
}

export function stripForUsCore(e: Expected): Expected {
  return {
    ...e, problems: [], allergies: [], vitals: [], anti: e.anti.filter((a) => a.view === "medications" || a.view === "labs"),
    medications: e.medications.map((r) => ({ ...r, fields: { ...r.fields, status_since: undefined, stop_reason: undefined, scoreIngredient: false } as typeof r.fields })),
  };
}

export function rowsFor(viewSet: ViewSet["name"], out: unknown) {
  return viewSet === "uscore" ? projectUsCore(out) : (out as any);
}

export function evaluateTransform(transformTs: string, source: Source, viewSet: ViewSet["name"], split: Split = "test", opts: { patients?: PatientRef[]; asOf?: string } = {}): Eval {
  const asOf = opts.asOf ?? EVAL_AS_OF;
  const dir = stage(transformTs, viewSet);
  const tsc = typecheck(dir);
  const contract = contractIssues(transformTs);
  const pts = opts.patients ?? patientsIn(source, split);
  const jobs: Job[] = pts.map((p) => ({ patient: p.patient, asOf, items: itemsForPatient(source, p) }));
  const ex = execute(dir, jobs, { determinism: true });
  const ev: Eval = {
    source, viewSet, split, asOf, tsc, contract, deterministic: ex.deterministic, execError: ex.error,
    runtime: { patients: jobs.length, items: jobs.reduce((a, j) => a + j.items.length, 0), ms: 0, msPerItem: 0, patientErrors: [] },
    counts: {} as Eval["counts"], byModality: {}, traps: {}, anti: [], extras: {} as Eval["extras"], wrongRows: [],
  };
  const counts: Record<string, Counts> = Object.fromEntries([...VIEWS, "all"].map((v) => [v, zero()]));
  const byMod: Record<string, Counts> = {};
  const extras: Record<string, number> = Object.fromEntries(VIEWS.map((v) => [v, 0]));
  let fhir = viewSet === "uscore" ? { resources: 0, conformant: 0, problems: {} as Record<string, number> } : undefined;
  for (const run of ex.runs) {
    ev.runtime.ms += run.ms;
    const p = patientById(run.patient);
    const ref = pts.find((x) => x.patient === run.patient)!;
    let exp = expectedFor(p, source, run.asOf, trapIndex(p));
    if (viewSet === "uscore") exp = stripForUsCore(exp);
    const failed = !!run.error;
    if (failed) ev.runtime.patientErrors.push({ patient: run.patient, error: run.error! });
    if (fhir && !failed) {
      const c = checkUsCore(run.rows, ref.sources[source]!);
      fhir.resources += c.resources; fhir.conformant += c.conformant;
      for (const [k, n] of Object.entries(c.problems)) fhir.problems[k] = (fhir.problems[k] ?? 0) + n;
    }
    const sc = scoreRows(exp, failed ? undefined : rowsFor(viewSet, run.rows));
    for (const r of sc.rows) {
      const c = rowCounts(r);
      add(counts[r.view], c); add(counts.all, c); add((byMod[r.modality] ??= zero()), c);
      if (!failed) for (const t of r.traps) { const s = (ev.traps[t] ??= { facts: 0, errors: 0 }); s.facts++; if (rowWrong(r)) s.errors++; }
      if (rowWrong(r) && !failed) ev.wrongRows.push(wrongRow(run.patient, ref.sources[source]!, source, r));
    }
    for (const x of sc.extras) { counts[x.view].fp += x.fp; counts.all.fp += x.fp; extras[x.view]++; add((byMod["unmatched-output"] ??= zero()), { tp: 0, fp: x.fp, fn: 0 }); }
    if (!failed) for (const a of sc.anti) for (const t of a.row.traps) {
      const s = (ev.traps[t] ??= { facts: 0, errors: 0 }); s.facts++;
      if (a.hit) { s.errors++; ev.anti.push({ trap: t, reason: a.hit.reason, patient: run.patient, actual: a.hit.actual }); }
    }
  }
  ev.runtime.msPerItem = ev.runtime.items ? ev.runtime.ms / ev.runtime.items : 0;
  ev.counts = Object.fromEntries(Object.entries(counts).map(([k, c]) => [k, prf(c)])) as Eval["counts"];
  ev.byModality = Object.fromEntries(Object.entries(byMod).map(([k, c]) => [k, prf(c)]));
  ev.extras = extras as Eval["extras"];
  if (fhir) ev.fhir = fhir;
  return ev;
}

function wrongRow(patient: string, local: string, source: Source, r: RowOutcome): WrongRow {
  return {
    patient, local, view: r.view, key: r.key, matched: r.matched, duplicated: r.duplicated,
    wrong: r.fields.filter((f) => !f.ok).map((f) => ({ field: f.field, expected: f.expected, actual: f.actual })),
    traps: r.traps, modality: r.modality, basis: r.basis, items: itemIdsFor(patient, source, r.basis), evidence: r.evidence,
  };
}

/** Compact summary for logs and provenance. */
export function summary(ev: Eval) {
  const pct = (x: number | null) => (x === null ? "n/a" : `${(100 * x).toFixed(1)}%`);
  return `tsc=${ev.tsc.ok ? "ok" : "FAIL"} det=${ev.deterministic} errors=${ev.runtime.patientErrors.length}/${ev.runtime.patients}${ev.execError ? ` EXEC: ${ev.execError.slice(0, 120)}` : ""} ` +
    `P=${pct(ev.counts.all.precision)} R=${pct(ev.counts.all.recall)} ` + VIEWS.map((v) => `${v.slice(0, 4)}:${pct(ev.counts[v].recall)}`).join(" ") + ` ${ev.runtime.msPerItem.toFixed(3)}ms/item`;
}

export { VIEW_SETS };
