// Field-level comparison of a mapper's rows with expected rows (per-source keys or the merged key).
//
// Each expected row is matched to at most one mapper row (meds by ingredient, problems by condition
// family, allergies by substance, labs by analyte + collection minute, vitals by setting + time within
// 10 minutes). Every scored field of a matched row is right or wrong; an unmatched expected row loses
// all its fields; an unmatched mapper row counts as false positives (presence + each scored field it
// asserts). A matched expected row is also wrong if the mapper emitted it twice (duplicates).
// Anti rows (facts that must not appear) are checked against mapper rows left unmatched.

import { DRUGS } from "../../truth/src/catalog.ts";
import { type Expected, family, type KeyRow, type Modality } from "./keys.ts";

export type View = "medications" | "problems" | "allergies" | "labs" | "vitals";
export const VIEWS: View[] = ["medications", "problems", "allergies", "labs", "vitals"];

export interface FieldOutcome { field: string; ok: boolean; expected?: unknown; actual?: unknown }
export interface RowOutcome {
  view: View; key: string; matched: boolean; duplicated: number; fields: FieldOutcome[];
  traps: string[]; modality: Modality; basis: string[]; evidence?: unknown;
}
export interface AntiHit { view: View; reason: string; traps: string[]; basis: string[]; actual: unknown }
export interface Extra { view: View; fp: number; row: unknown }
export interface Scored { rows: RowOutcome[]; extras: Extra[]; anti: { row: KeyRow<any>; hit?: AntiHit }[] }

// ─── Normalization ─────────────────────────────────────────────────────────────────────────────────

const SALTS = /\b(hydrochloride|hcl|potassium|sodium|succinate|calcium|maleate|tartrate|besylate|er|xl|extended|release|oral|tablet|tab|capsule|pen|injector|injection|mg|ml|unt|units?|\d+(\.\d+)?)\b/g;
const BRANDS: Record<string, string> = Object.fromEntries(Object.values(DRUGS).filter((d) => d.brand).map((d) => [d.brand!.toLowerCase(), d.ingredient]));
BRANDS["lantus"] = "insulin glargine"; BRANDS["levemir"] = "insulin detemir"; BRANDS["humalog"] = "insulin lispro";
BRANDS["advil"] = "ibuprofen"; BRANDS["motrin"] = "ibuprofen"; BRANDS["aleve"] = "naproxen";

export function normDrug(s: string | undefined): string {
  if (!s) return "";
  let x = s.toLowerCase();
  for (const [b, ing] of Object.entries(BRANDS)) if (new RegExp(`\\b${b}\\b`).test(x)) x = x.replace(new RegExp(`\\b${b}\\b`), ing);
  return x.replace(/[^a-z0-9. ]+/g, " ").replace(SALTS, " ").replace(/\s+/g, " ").trim();
}
const tokens = (s: string) => s.split(" ").filter(Boolean);
function drugMatches(keyIng: string, text: string): boolean {
  const k = tokens(normDrug(keyIng)), t = new Set(tokens(normDrug(text)));
  return k.length > 0 && k.every((w) => t.has(w));
}

const UNIT_SYN: Record<string, string> = {
  "k/ul": "10*3/uL", "10^3/ul": "10*3/uL", "10*3/ul": "10*3/uL", "x10e3/ul": "10*3/uL", "10e3/ul": "10*3/uL", "thousand/ul": "10*3/uL", "x10^3/ul": "10*3/uL",
  "ml/min/1.73m2": "mL/min/1.73m2", "ml/min/{1.73_m2}": "mL/min/1.73m2", "ml/min/1.73 m2": "mL/min/1.73m2", "ml/min/1.73m^2": "mL/min/1.73m2",
  "mg/g{creat}": "mg/g", "mg/g": "mg/g", "mg/dl": "mg/dL", "mmol/l": "mmol/L", "g/dl": "g/dL", "u/l": "U/L", "ng/ml": "ng/mL", "%": "%", "mmhg": "mmHg", "[ph]": "[pH]", "": "",
};
export const normUnit = (u: unknown) => (typeof u === "string" ? UNIT_SYN[u.toLowerCase().trim()] ?? u.trim() : String(u ?? ""));
const normDoseUnit = (u: unknown) => {
  const x = String(u ?? "").toLowerCase();
  return /^(unit|units|\[iu\]|iu|unt)$/.test(x) ? "units" : /^(tab|tabs|tablet|tablets|\{tbl\})$/.test(x) ? "tablet" : x === "ug" ? "mcg" : x;
};
export const normAnalyte = (a: unknown) => String(a ?? "").toLowerCase().replace(/-/g, "_");
const minuteOf = (iso: unknown) => { const t = Date.parse(String(iso)); return Number.isNaN(t) ? NaN : Math.floor(t / 60000); };
const localMinute = (s: unknown) => { const m = String(s ?? "").match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) / 60000 : NaN; };

// ─── Matching per view ─────────────────────────────────────────────────────────────────────────────

type Row = Record<string, any>;

function keyName(view: View, f: any): string {
  switch (view) {
    case "medications": return f.ingredient;
    case "problems": return f.family;
    case "allergies": return f.substance;
    case "labs": return `${f.analyte}@${f.collected}`;
    case "vitals": return `${f.setting}@${f.local_time}`;
  }
}

/** Score of how well mapper row `r` matches expected fields `f` (0 = no match). */
function matchScore(view: View, f: any, r: Row): number {
  switch (view) {
    case "medications": {
      if (f.ingredientDerivable === false) return normDrug(r.drug_name) === normDrug(f.names?.[0]) || (r.ingredient && drugMatches(f.ingredient, r.ingredient)) ? 2 : 0;
      if (r.ingredient && drugMatches(f.ingredient, r.ingredient)) return 3;
      if (drugMatches(f.ingredient, r.drug_name ?? "")) return 2;
      return 0;
    }
    case "problems": return family(r.icd10cm, r.condition) === f.family ? 2 : 0;
    case "allergies": return drugMatches(f.substance, r.substance ?? "") ? 2 : 0;
    case "labs": return normAnalyte(r.analyte) === f.analyte && minuteOf(r.collected) === minuteOf(f.collected) ? 2 : 0;
    case "vitals": {
      if (r.setting !== f.setting) return 0;
      const d = Math.abs(localMinute(r.local_time) - localMinute(f.local_time));
      return d <= 10 ? 20 - d : 0;
    }
  }
}

const eqNum = (a: unknown, b: number, tol: number) => typeof a === "number" && Math.abs(a - b) <= tol;

function compareFields(view: View, f: any, r: Row): FieldOutcome[] {
  const out: FieldOutcome[] = [];
  const add = (field: string, ok: boolean, expected: unknown, actual: unknown) => out.push({ field, ok, expected, actual });
  switch (view) {
    case "medications":
      add("status", r.status === f.status, f.status, r.status);
      if (f.dose) add("dose", !!r.dose && eqNum(r.dose.value, f.dose.value, 1e-6) && normDoseUnit(r.dose.unit) === normDoseUnit(f.dose.unit), f.dose, r.dose);
      if (f.frequency) add("frequency", f.frequency.includes(r.frequency), f.frequency[0], r.frequency);
      if (f.status_since) add("status_since", r.status_since === f.status_since, f.status_since, r.status_since);
      if (f.stop_reason) add("stop_reason", r.stop_reason === f.stop_reason, f.stop_reason, r.stop_reason);
      break;
    case "problems":
      add("status", r.status === f.status, f.status, r.status);
      if (f.ckd_stage) add("ckd_stage", r.ckd_stage === f.ckd_stage, f.ckd_stage, r.ckd_stage);
      if (f.onset) add("onset", r.onset?.value === f.onset.value && r.onset?.precision === f.onset.precision, f.onset, r.onset);
      break;
    case "allergies":
      add("type", r.type === f.type, f.type, r.type);
      if (f.criticality) add("criticality", r.criticality === f.criticality, f.criticality, r.criticality);
      break;
    case "labs": {
      const tol = Math.max(0.0051, Math.abs(f.value) * 0.001);
      add("value", eqNum(r.value, f.value, tol) && (r.comparator ?? undefined) === (f.comparator ?? undefined), `${f.comparator ?? ""}${f.value}`, `${r.comparator ?? ""}${r.value}`);
      add("unit", normUnit(r.unit) === normUnit(f.unit), f.unit, r.unit);
      if (f.egfr_equation) add("egfr_equation", r.egfr_equation === f.egfr_equation, f.egfr_equation, r.egfr_equation);
      break;
    }
    case "vitals":
      for (const k of ["systolic_mmhg", "diastolic_mmhg", "repeat_systolic_mmhg", "repeat_diastolic_mmhg", "pulse_bpm"]) if (f[k] !== undefined) add(k, eqNum(r[k], f[k], 0), f[k], r[k]);
      if (f.weight_kg !== undefined) add("weight_kg", eqNum(r.weight_kg, f.weight_kg, 0.15), f.weight_kg, r.weight_kg);
      if (f.glucose_mg_dl !== undefined) add("glucose_mg_dl", eqNum(r.glucose_mg_dl, f.glucose_mg_dl, 2), f.glucose_mg_dl, r.glucose_mg_dl);
      break;
  }
  return out;
}

/** How many scored fields an unmatched mapper row asserts (it counts as that many false positives, plus presence). */
function assertedFields(view: View, r: Row): number {
  const keys: Record<View, string[]> = {
    medications: ["status", "dose", "frequency"], problems: ["status", "ckd_stage", "onset"], allergies: ["type", "criticality"],
    labs: ["value", "unit"], vitals: ["systolic_mmhg", "diastolic_mmhg", "pulse_bpm", "weight_kg", "glucose_mg_dl"],
  };
  return keys[view].filter((k) => r[k] !== undefined).length;
}

function antiMatches(view: View, f: any, r: Row): boolean {
  switch (view) {
    case "medications": return (r.ingredient ? drugMatches(f.ingredient, r.ingredient) : drugMatches(f.ingredient, r.drug_name ?? "")) && (!f.dose || (r.dose && eqNum(r.dose.value, f.dose.value, 1e-6)));
    case "problems": return family(r.icd10cm, r.condition) === f.family;
    case "labs": return normAnalyte(r.analyte) === f.analyte && minuteOf(r.collected) === minuteOf(f.collected) && eqNum(r.value, f.value, Math.max(0.0051, Math.abs(f.value) * 0.001));
    case "vitals": return r.setting === f.setting && Math.abs(localMinute(r.local_time) - localMinute(f.local_time)) <= 3
      && (f.systolic_mmhg === undefined || r.systolic_mmhg === f.systolic_mmhg) && (f.glucose_mg_dl === undefined || eqNum(r.glucose_mg_dl, f.glucose_mg_dl, 2));
    default: return false;
  }
}

export function scoreRows(exp: Expected, actual: Partial<Record<View, Row[]>> | undefined): Scored {
  const rows: RowOutcome[] = [], extras: Extra[] = [];
  const unmatchedByView = new Map<View, Row[]>();
  for (const view of VIEWS) {
    const mine: Row[] = Array.isArray(actual?.[view]) ? (actual![view] as Row[]).filter((r) => r && typeof r === "object") : [];
    const used = new Set<number>();
    const keyRows = exp[view] as KeyRow<any>[];
    // Best-first assignment: highest match score pairs first.
    const pairs: { k: number; m: number; s: number }[] = [];
    keyRows.forEach((kr, k) => mine.forEach((r, m) => { const s = matchScore(view, kr.fields, r); if (s > 0) pairs.push({ k, m, s }); }));
    pairs.sort((a, b) => b.s - a.s || a.k - b.k || a.m - b.m);
    const assigned = new Map<number, number>();
    for (const p of pairs) if (!assigned.has(p.k) && !used.has(p.m)) { assigned.set(p.k, p.m); used.add(p.m); }
    keyRows.forEach((kr, k) => {
      const m = assigned.get(k);
      const r = m === undefined ? undefined : mine[m];
      const fields = r ? compareFields(view, kr.fields, r) : compareFields(view, kr.fields, {}).map((x) => ({ ...x, ok: false, actual: undefined }));
      rows.push({ view, key: keyName(view, kr.fields), matched: !!r, duplicated: 0, fields, traps: kr.traps, modality: kr.modality, basis: kr.basis, evidence: r?.evidence });
    });
    const left = mine.filter((_, i) => !used.has(i));
    // Duplicates: a leftover row that would have matched an expected row of the same view.
    const outcomes = rows.filter((x) => x.view === view);
    const rest: Row[] = [];
    for (const r of left) {
      const k = keyRows.findIndex((kr) => matchScore(view, kr.fields, r) > 0 && (view !== "vitals" || matchScore(view, kr.fields, r) >= 17));
      if (k >= 0 && outcomes[k].matched) outcomes[k].duplicated++;
      rest.push(r);
    }
    unmatchedByView.set(view, rest);
    for (const r of rest) extras.push({ view, fp: 1 + assertedFields(view, r), row: r });
  }
  const anti = exp.anti.map((a) => {
    const view = a.view as View;
    const r = (unmatchedByView.get(view) ?? []).find((x) => antiMatches(view, a.fields, x));
    return { row: a, hit: r ? { view, reason: (a.fields as any).reason, traps: a.traps, basis: a.basis, actual: r } : undefined };
  });
  return { rows, extras, anti };
}

// ─── Aggregation ───────────────────────────────────────────────────────────────────────────────────

export interface Counts { tp: number; fp: number; fn: number }
export const zero = (): Counts => ({ tp: 0, fp: 0, fn: 0 });
export const add = (a: Counts, b: Counts) => { a.tp += b.tp; a.fp += b.fp; a.fn += b.fn; return a; };
export const prf = (c: Counts) => ({ precision: c.tp + c.fp ? c.tp / (c.tp + c.fp) : null, recall: c.tp + c.fn ? c.tp / (c.tp + c.fn) : null, ...c });

/** Field counts: presence + each scored field. */
export function rowCounts(r: RowOutcome): Counts {
  const c = zero();
  if (!r.matched) { c.fn += 1 + r.fields.length; return c; }
  c.tp += 1;
  for (const f of r.fields) {
    if (f.ok) c.tp++;
    else { c.fn++; if (f.actual !== undefined) c.fp++; }
  }
  c.fp += r.duplicated;
  return c;
}

export function rowWrong(r: RowOutcome): boolean { return !r.matched || r.duplicated > 0 || r.fields.some((f) => !f.ok); }
