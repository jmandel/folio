// Per-source expected views: what a correct reader of ONE source's records alone should conclude, as of
// a date. Computed from the clinical truth (packages/truth) plus knowledge of how each renderer
// (packages/render) writes the truth into that source, never from the rendered items themselves. So a
// stale Northgate outside line shows finerenone active in Northgate's key even though the truth says
// held, and Riverside's key lists cough as an intolerance because Riverside's reaction text says cough.
//
// Each expected row carries: the fields that are scored, the truth ids it rests on (`basis`), the traps
// those facts carry in this source, and whether the source narrates the fact. "Anti rows" are facts the
// source renders that must NOT appear in a correct mapper's output (a withdrawn potassium, a voided
// order, a ruled-out diagnosis); a mapper row that matches one is a trap error.

import { drug, MGDL_PER_MMOL_GLUCOSE } from "../../truth/src/catalog.ts";
import {
  at as localAt, EGFR_2021_FROM, inZone, localDate, type LabResult, type Medication, ms, type Patient, type SourceKey, sortKey, wall,
} from "../../truth/src/model.ts";
import { medDoseAt } from "../../render/src/describe.ts";
import { icdDisplay } from "../../render/src/context.ts";

export type Modality = "structured" | "narrated" | "prose-only";

export interface KeyRow<F> {
  view: "medications" | "problems" | "allergies" | "labs" | "vitals";
  /** Fields compared with the mapper's row (undefined = not scored). */
  fields: F;
  basis: string[];
  traps: string[];
  modality: Modality;
  /** Not scored: recency used to keep one row per ingredient (the view's rule) when a source has several. */
  order?: number;
  /** Item ids (this source) that carry the fact; set by the harness before scoring `evidence`. */
  items?: string[];
}

export interface MedKey {
  ingredient: string;               // truth ingredient (match key)
  names: string[];                  // other names a mapper may use (as written by the source)
  ingredientDerivable: boolean;     // false when the source does not say which drug (patient typed "water pill")
  status: "active" | "held" | "stopped" | "unknown";
  status_since?: string;            // scored only where the source dates the status change
  dose?: { value: number; unit: string };
  frequency?: string[];             // acceptable codes
  stop_reason?: string;
  patient_reported?: boolean;
  otc?: boolean;
  sensitivity?: string[];
  /** false: do not score `ingredient` (US Core output need not carry it when an RxNorm product code is given). */
  scoreIngredient?: boolean;
}
export interface ProblemKey { family: string; condition: string; icd10?: string; status: "active" | "resolved"; ckd_stage?: string; onset?: { value: string; precision: string }; sensitivity?: string[] }
export type ReactionType = "hypersensitivity" | "side_effect" | "serious_adverse_event";
export interface AllergyKey {
  substance: string; reaction_type: ReactionType; criticality?: "low" | "high" | "unknown"; onset?: { value: string; precision: string };
  /** Words the recorded reaction must share with the mapper's `reaction` (any one suffices). */
  reaction?: string[];
  /** Acceptable mechanisms: the truth knows no immune-mediated reaction, so 'immune' is always wrong here. */
  mechanism?: string[];
}
const RT: Record<string, ReactionType> = { allergy: "hypersensitivity", intolerance: "side_effect", "adverse-reaction": "serious_adverse_event" };
const words = (xs: string[]) => [...new Set(xs.join(" ").toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3))];
export interface LabKey { analyte: string; value: number; comparator?: string; unit: string; collected: string; egfr_equation?: string; status?: "final" | "preliminary" }
export interface VitalKey {
  setting: "clinic" | "hospital" | "home"; local_time: string;
  systolic_mmhg?: number; diastolic_mmhg?: number; repeat_systolic_mmhg?: number; repeat_diastolic_mmhg?: number;
  pulse_bpm?: number; weight_kg?: number; glucose_mg_dl?: number;
}

export interface Expected {
  medications: KeyRow<MedKey>[];
  problems: KeyRow<ProblemKey>[];
  allergies: KeyRow<AllergyKey>[];
  labs: KeyRow<LabKey>[];
  vitals: KeyRow<VitalKey>[];
  anti: KeyRow<Record<string, any> & { reason: string }>[];
}

export const SOURCE_KEY: Record<string, SourceKey> = { riverside: "A", northgate: "B", lakeview: "C", homelog: "P" };

/** End of the local day `asOf` (America/Chicago) as epoch ms. */
export function endOfDay(asOf: string): number {
  return ms(localAt(`${asOf}T23:59:59`));
}

const ld = (w: string) => localDate(w);
const stageOf = (s?: string) => {
  if (!s) return {};
  const m = s.match(/^(\d[ab]?)(?:\s+(A\d))?/);
  return m ? { ckd_stage: `G${m[1]}`, albuminuria: m[2] } : {};
};
const onsetOf = (w: string) => ({ value: w.includes("T") ? localDate(w) : w, precision: w.includes("T") || w.length === 10 ? "day" : w.length === 7 ? "month" : "year" });
const doseOf = (d?: { value: number; unit: string }) => (d ? { value: d.value, unit: d.unit === "units" || d.unit === "unit" ? "units" : d.unit } : undefined);
const FREQ_OK: Record<string, string[]> = { QD: ["QD"], BID: ["BID"], TID: ["TID"], QHS: ["QHS"], QW: ["QW", "other"], PRN: ["PRN"] };

export const ANALYTE_KEY: Record<string, string> = { "anion-gap": "anion_gap" };
const analyteName = (a: string) => ANALYTE_KEY[a] ?? a;
const UNIT: Record<string, string> = {
  creatinine: "mg/dL", egfr: "mL/min/1.73m2", potassium: "mmol/L", sodium: "mmol/L", chloride: "mmol/L", bicarbonate: "mmol/L", anion_gap: "mmol/L",
  bun: "mg/dL", glucose: "mg/dL", a1c: "%", uacr: "mg/g", platelets: "10*3/uL", wbc: "10*3/uL", hemoglobin: "g/dL", bhb: "mmol/L", ph: "[pH]",
  pco2: "mmHg", lipase: "U/L", troponin: "ng/mL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};
// Decimal places each source prints (renderers' tables).
const DEC_C: Record<string, number> = { creatinine: 2, sodium: 0, potassium: 1, glucose: 0, a1c: 1, uacr: 0, wbc: 1, hemoglobin: 1, platelets: 0, cholesterol: 0, triglycerides: 0, hdl: 0, ldl: 0, egfr: 0 };
const DEC_A: Record<string, number> = {
  sodium: 0, potassium: 1, chloride: 0, bicarbonate: 0, "anion-gap": 0, bun: 0, creatinine: 2, egfr: 0, glucose: 0, ph: 2, pco2: 0, bhb: 1, troponin: 2,
  lipase: 0, wbc: 1, hemoglobin: 1, platelets: 0, a1c: 1, uacr: 0, cholesterol: 0, triglycerides: 0, hdl: 0, ldl: 0,
};
const round = (v: number, d: number) => Number(v.toFixed(d));

// ─── Trap tags and modality ────────────────────────────────────────────────────────────────────────

export interface TrapIndex {
  /** truth id -> traps carried by the fact in the truth (fact-level and assignments). */ fact: Map<string, Set<string>>;
  /** `${source}|${truthId}` -> traps on rendered items of that source mentioning the fact. */ item: Map<string, Set<string>>;
  /** `${source}|${truthId}` -> earliest `recorded` (epoch ms) of a rendered item of that source carrying the fact. */ recorded?: Map<string, number>;
  /** `${source}|${renderKey}` -> `recorded` of that rendered item (HomeLog list saves). */ itemRecorded?: Map<string, number>;
}

export function factTraps(p: Patient): Map<string, Set<string>> {
  const ft = new Map<string, Set<string>>();
  const add = (f: string, t: string) => { if (!ft.has(f)) ft.set(f, new Set()); ft.get(f)!.add(t); };
  for (const a of p.traps) for (const f of a.factIds) add(f, a.trap);
  for (const x of [...p.meds, ...p.labs, ...p.conditions, ...p.allergies, ...p.narrativeFacts] as { id: string; traps?: string[] }[]) for (const t of x.traps ?? []) add(x.id, t);
  return ft;
}

/** Traps of a fact in a source: fact-level traps that the source's rendered items also carry. */
export function trapsFor(ix: TrapIndex, s: SourceKey, ids: string[]): string[] {
  const out = new Set<string>();
  for (const id of ids) {
    const f = ix.fact.get(id), it = ix.item.get(`${s}|${id}`);
    if (f && it) for (const t of f) if (it.has(t)) out.add(t);
  }
  return [...out].sort((a, b) => +a.slice(1) - +b.slice(1));
}

function modality(v: { visibility?: Partial<Record<SourceKey, string>> } | undefined, s: SourceKey): Modality {
  const m = v?.visibility?.[s];
  return m === "both" ? "narrated" : m === "prose" ? "prose-only" : "structured";
}

// ─── Per-source keys ───────────────────────────────────────────────────────────────────────────────

export function expectedFor(p: Patient, source: string, asOf: string, ix: TrapIndex): Expected {
  const s = SOURCE_KEY[source];
  const t = endOfDay(asOf);
  const e: Expected = { medications: [], problems: [], allergies: [], labs: [], vitals: [], anti: [] };
  if (!p.sources[s]) return e;
  if (s === "B") northgate(p, t, e, ix);
  if (s === "C") lakeview(p, t, e, ix);
  if (s === "A") riverside(p, t, e, ix);
  if (s === "P") homelog(p, t, e, ix);
  // Scope by publication first: a fact counts only once some item of this source carrying it was recorded.
  if (ix.recorded) for (const view of ["medications", "problems", "allergies", "labs", "vitals"] as const) {
    (e as any)[view] = (e[view] as KeyRow<any>[]).filter((r) => r.basis.some((b) => (ix.recorded!.get(`${s}|${b}`) ?? Infinity) <= t));
  }
  // Then the view's one row per ingredient: the most recent line/order/entry.
  const best = new Map<string, KeyRow<MedKey>>();
  for (const r of e.medications) {
    const k = r.fields.ingredientDerivable ? r.fields.ingredient : `name:${r.fields.names[0]}`;
    const prev = best.get(k);
    if (!prev || (r.order ?? 0) > (prev.order ?? 0)) best.set(k, r);
  }
  e.medications = [...best.values()];
  return e;
}

function row<F>(view: KeyRow<F>["view"], fields: F, basis: string[], s: SourceKey, ix: TrapIndex, mod: Modality, extraTraps: string[] = []): KeyRow<F> {
  const traps = [...new Set([...trapsFor(ix, s, basis), ...extraTraps])].sort((a, b) => +a.slice(1) - +b.slice(1));
  return { view, fields, basis, traps, modality: mod };
}

// Northgate: event log; lists replayed per line id; outside lines lag (T1); imported copies of Lakeview results.
function northgate(p: Patient, t: number, e: Expected, ix: TrapIndex) {
  const encs = p.encounters.filter((x) => x.source === "B").sort((a, b) => ms(a.start) - ms(b.start));
  const firstEnc = encs[0];

  // Medication lines.
  interface Line { med: Medication; events: { at: string; action: string; status: string }[]; outside?: boolean; voided?: boolean; voidAt?: string }
  const lines: Line[] = [];
  for (const m of p.meds.filter((x) => x.setting !== "inpatient")) {
    let cur: Line | undefined;
    let state: string | undefined;
    for (const h of m.history.filter((x) => x.by === "B")) {
      let at = h.at;
      if (!at.includes("T")) { if (!firstEnc) continue; at = new Date(ms(firstEnc.start) + (15 + p.meds.indexOf(m)) * 60000).toISOString(); }
      if (h.status === "entered-in-error") { if (cur) { cur.voided = true; cur.voidAt = at; } cur = undefined; state = undefined; continue; }
      let action: string | undefined;
      if (!cur) { if (h.status !== "active") continue; cur = { med: m, events: [] }; lines.push(cur); action = "start"; state = "active"; }
      else if (h.status === "stopped") action = "stop";
      else if (h.status === "held") { action = state === "held" ? undefined : "hold"; state = "held"; }
      else if (h.status === "active" && state === "held") { action = "resume"; state = "active"; }
      else if (h.status === "active" && (h.dose || h.product || h.frequency)) action = "change";
      if (!action) continue;
      cur.events.push({ at, action, status: action === "stop" ? "stopped" : action === "hold" ? "held" : "active" });
      if (action === "stop") { cur = undefined; state = undefined; }
    }
    for (const lag of m.laggingLines ?? []) if (lag.source === "B") lines.push({ med: m, outside: true, events: [{ at: lag.since, action: "start", status: "active" }] });
  }
  const byIngredient = new Map<string, Line[]>();
  for (const l of lines) {
    const ev = l.events.filter((x) => ms(x.at) <= t);
    if (!ev.length) continue;
    if (l.voided && l.voidAt && ms(l.voidAt) <= t) {
      e.anti.push(row("medications", { reason: "voided (entered in error) medication line", ingredient: drug(l.med.product).ingredient, dose: doseOf(medDoseAt(p, l.med.id, ev[0].at).dose) }, [l.med.id], "B", ix, "structured", ["T4"]));
      continue;
    }
    const ing = drug(medDoseAt(p, l.med.id, ev[ev.length - 1].at).product).ingredient;
    byIngredient.set(ing, [...(byIngredient.get(ing) ?? []), l]);
  }
  for (const [ing, ls] of byIngredient) {
    const last = (l: Line) => ms(l.events.filter((x) => ms(x.at) <= t).slice(-1)[0].at);
    const l = [...ls].sort((a, b) => last(b) - last(a))[0];
    const ev = l.events.filter((x) => ms(x.at) <= t);
    const cur = ev[ev.length - 1];
    let sinceIdx = ev.length - 1;
    while (sinceIdx > 0 && ev[sinceIdx - 1].status === cur.status && cur.status !== "active") sinceIdx--;
    if (cur.status === "active") sinceIdx = ev.map((x) => x.action).lastIndexOf(ev.some((x) => x.action === "resume") ? "resume" : "start");
    const d = l.outside ? { dose: l.med.dose, frequency: l.med.frequency, product: l.med.product } : medDoseAt(p, l.med.id, cur.action === "stop" || cur.action === "hold" ? new Date(ms(cur.at) - 60000).toISOString() : cur.at);
    const h = [...l.med.history].reverse().find((x) => x.by === "B" && x.status === "stopped" && Math.abs(sortKey(x.at) - ms(cur.at)) < 120000);
    e.medications.push(row("medications", {
      ingredient: ing, names: [drug(d.product).scdName], ingredientDerivable: true, status: cur.status as MedKey["status"],
      status_since: cur.status === "active" ? undefined : ld(ev[sinceIdx].at),
      dose: doseOf(d.dose), frequency: FREQ_OK[d.frequency], stop_reason: cur.status === "stopped" ? h?.stopReason ?? "other" : undefined,
      patient_reported: false, ...(l.med.sensitive ? { sensitivity: ["mental-health"] } : {}),
    }, [l.med.id], "B", ix, modality(l.med, "B"), l.outside ? ["T1"] : []));
    e.medications[e.medications.length - 1].order = ms(cur.at);
  }

  // Problems.
  for (const c of p.conditions) {
    const bh = c.history.filter((h) => h.recordedBy === "B" && sortKey(h.at) <= t);
    if (!bh.length) continue;
    const last = bh[bh.length - 1];
    const stage = [...bh].reverse().find((h) => h.stage)?.stage;
    const icd = [...bh].reverse().find((h) => h.icd10)?.icd10 ?? c.coding.find((x) => x.system === "icd10")!.code;
    e.problems.push(row("problems", {
      family: family(icd, c.name), condition: c.name, icd10: icd, status: last.status === "resolved" ? "resolved" : "active",
      ...(/^N18/.test(icd) ? { ckd_stage: stageOf(stage).ckd_stage } : {}), onset: onsetOf(c.onset), ...(c.sensitive ? { sensitivity: ["mental-health"] } : {}),
    } as ProblemKey, [c.id], "B", ix, modality(c, "B")));
  }

  // Allergies.
  for (const a of p.allergies.filter((x) => x.recordedBy === "B" && sortKey(x.recordedAt) <= t)) {
    e.allergies.push(row("allergies", { substance: a.substance.display, reaction_type: RT[a.type], criticality: a.criticality, onset: onsetOf(a.onset), reaction: words(a.reactions), mechanism: ["non_immune", "unknown"] } as AllergyKey, [a.id], "B", ix, modality(a, "B")));
  }

  // Imported results (copies of Lakeview results with copies including B).
  const drawsWithB = new Set(p.labs.filter((l) => l.copies?.includes("B")).map((l) => l.draw));
  for (const l of p.labs) {
    if (l.performedBy !== "C" || !drawsWithB.has(l.draw) || l.duplicateOf || !l.copies?.includes("B")) continue;
    if (!l.resultedAt || ms(l.resultedAt) > t) continue;
    labRows(p, l, "B", t, e, ix);
  }

  // Vitals.
  for (const v of p.vitals.filter((x) => x.source === "B" && ms(x.at) <= t)) {
    if (!encs.some((x) => localDate(x.start) === localDate(v.at))) continue;
    e.vitals.push(row("vitals", {
      setting: "clinic", local_time: wall(v.at), ...(v.bp ? { systolic_mmhg: v.bp.systolic, diastolic_mmhg: v.bp.diastolic } : {}),
      ...(v.bpRepeat ? { repeat_systolic_mmhg: v.bpRepeat.systolic, repeat_diastolic_mmhg: v.bpRepeat.diastolic } : {}),
      ...(v.pulse !== undefined ? { pulse_bpm: v.pulse } : {}), ...(v.weightKg !== undefined ? { weight_kg: Math.round(Math.round((v.weightKg / 0.45359237) * 10) / 10 * 0.45359237 * 10) / 10 } : {}),
    } as VitalKey, [v.id], "B", ix, "structured"));
  }
}

/** A Lakeview result as Lakeview (C) or its Northgate copy (B) reports it; withdrawn values become anti rows. */
function labRows(p: Patient, l: LabResult, s: "B" | "C", t: number, e: Expected, ix: TrapIndex) {
  const a = analyteName(l.analyte);
  const withdrawn = l.status === "corrected-away" && (!l.correctedAt || ms(l.correctedAt) <= t);
  if (l.status === "entered-in-error") return;
  const mod = modality(l, s);
  if (l.analyte === "egfr") {
    const rep = (l.reported ?? []).find((r) => r.equation === "ckd-epi-2009-nonaa") ?? (l.reported ?? []).find((r) => r.equation === "ckd-epi-2021") ?? { equation: "ckd-epi-2021" as const, value: l.value };
    const fields: LabKey = { status: "final", analyte: "egfr", value: rep.value, ...(rep.comparator ? { comparator: rep.comparator } : {}), unit: UNIT.egfr, collected: l.collectedAt, egfr_equation: rep.equation === "ckd-epi-2021" ? "ckd-epi-2021" : "ckd-epi-2009" };
    const aa = (l.reported ?? []).find((r) => r.equation === "ckd-epi-2009-aa");
    // eGFR rows depend on the creatinine they were calculated from.
    const cr = p.labs.find((x) => x.id === l.derivedFrom?.[0]);
    const crWithdrawn = cr && cr.status === "corrected-away" && (!cr.correctedAt || ms(cr.correctedAt) <= t);
    if (crWithdrawn) { e.anti.push(row("labs", { ...fields, reason: "eGFR from a withdrawn creatinine" }, [l.id], s, ix, mod, ["T3"])); return; }
    if (aa && aa.value !== rep.value) e.anti.push(row("labs", { analyte: "egfr", value: aa.value, ...(aa.comparator ? { comparator: aa.comparator } : {}), collected: l.collectedAt, reason: "race-coefficient eGFR variant" }, [l.id], s, ix, mod, ["T11"]));
    e.labs.push(row("labs", fields, [l.id], s, ix, mod, ms(l.collectedAt) < Date.parse(EGFR_2021_FROM) ? ["T11"] : []));
    return;
  }
  const v = round(l.value, DEC_C[l.analyte] ?? 1);
  const fields: LabKey = { status: "final", analyte: a, value: v, ...(l.comparator ? { comparator: l.comparator } : {}), unit: UNIT[a], collected: l.collectedAt };
  if (withdrawn) { e.anti.push(row("labs", { ...fields, reason: "result withdrawn by the lab (corrected away)" }, [l.id], s, ix, mod, ["T3"])); return; }
  e.labs.push(row("labs", fields, [l.id], s, ix, mod));
}

// Lakeview: table rows; requisitions superseded on correction; med status in MED_STATUS_HIST rows.
function lakeview(p: Patient, t: number, e: Expected, ix: TrapIndex) {
  const contacts = p.encounters.filter((x) => x.source === "C" && ms(x.start) <= t).sort((a, b) => ms(a.start) - ms(b.start));
  const contactDays = new Set(contacts.map((c) => localDate(c.start)));

  for (const m of p.meds) {
    const ce = m.history.filter((h) => h.by === "C" && contactDays.has(localDate(h.at)) && sortKey(h.at) <= t);
    if (!ce.length) continue;
    const last = ce[ce.length - 1];
    const d = drug(ce[0].product ?? m.product);
    if (last.status === "entered-in-error" || ce[0].status === "entered-in-error") {
      e.anti.push(row("medications", { reason: "prescription entered in error", ingredient: d.ingredient }, [m.id], "C", ix, "structured", ["T4"]));
      continue;
    }
    let i = ce.length - 1;
    while (i > 0 && ce[i - 1].status === last.status) i--;
    const status = last.status === "stopped" ? "stopped" : last.status === "held" ? "held" : "active";
    e.medications.push(row("medications", {
      ingredient: d.ingredient, names: [`${d.ingredient} ${d.strength} mg ${d.form}`], ingredientDerivable: true, status,
      status_since: status === "active" ? undefined : ld(ce[i].at), dose: doseOf(ce[0].dose ?? m.dose), frequency: FREQ_OK[m.frequency], patient_reported: false,
    }, [m.id], "C", ix, modality(m, "C"), ce.some((h) => h.status === "held") ? ["T1"] : []));
    e.medications[e.medications.length - 1].order = sortKey(last.at);
  }

  // Problems: latest VISIT_DX per condition; 'R' and 'P' are not problems.
  const latest = new Map<string, { status?: string; icd?: string; label?: string; at: string }>();
  for (const c of contacts) for (const a of c.addressed ?? []) latest.set(a.conditionId, { status: a.status, icd: a.icd10, label: a.label, at: c.start });
  let stage: { g: string; a?: string } | undefined;
  for (const c of contacts) if (c.ckdCategory) stage = c.ckdCategory;
  for (const [cid, st] of latest) {
    const c = p.conditions.find((x) => x.id === cid)!;
    const icd = st.icd ?? [...c.history].reverse().find((h) => h.icd10 && sortKey(h.at) <= ms(st.at))?.icd10 ?? c.coding.find((x) => x.system === "icd10")!.code;
    const text = st.label ?? icdDisplay(icd);
    if (st.status === "ruled-out" || st.status === "working") {
      e.anti.push(row("problems", { reason: `diagnosis ${st.status} at the latest contact`, family: family(icd, text), condition: text }, [c.id], "C", ix, "structured", ["T12"]));
      continue;
    }
    e.problems.push(row("problems", {
      family: family(icd, text), condition: text, icd10: icd, status: st.status === "history" ? "resolved" : "active",
      ...(/^N18/.test(icd) && stage ? { ckd_stage: stage.g } : {}),
    } as ProblemKey, [c.id], "C", ix, modality(c, "C"), /^N18/.test(icd) && stage ? ["T5"] : []));
  }

  for (const l of p.labs) {
    if (l.performedBy !== "C" || !l.resultedAt || ms(l.resultedAt) > t) continue;
    if (l.duplicateOf || l.status === "entered-in-error") {
      e.anti.push(row("labs", { reason: "result of an order entered in error (duplicate order)", analyte: analyteName(l.analyte), value: round(l.value, DEC_C[l.analyte] ?? 1), collected: l.collectedAt }, [l.id], "C", ix, "structured", ["T4"]));
      continue;
    }
    labRows(p, l, "C", t, e, ix);
  }

  for (const v of p.vitals.filter((x) => x.source === "C" && ms(x.at) <= t && contactDays.has(localDate(x.at)))) {
    e.vitals.push(row("vitals", {
      setting: "clinic", local_time: wall(v.at), ...(v.bp ? { systolic_mmhg: v.bp.systolic, diastolic_mmhg: v.bp.diastolic } : {}),
      ...(v.bpRepeat ? { repeat_systolic_mmhg: v.bpRepeat.systolic, repeat_diastolic_mmhg: v.bpRepeat.diastolic } : {}),
      ...(v.pulse !== undefined ? { pulse_bpm: v.pulse } : {}), ...(v.weightKg !== undefined ? { weight_kg: v.weightKg } : {}),
    } as VitalKey, [v.id], "C", ix, "structured"));
  }
}

/** The home medication list a Riverside document re-lists for an encounter (renderer rule). */
function homeList(p: Patient, enc: Patient["encounters"][number]): Medication[] {
  return p.meds.filter((m) => m.setting !== "inpatient" && m.visibility.A && !m.otc).filter((m) => {
    const before = m.history.filter((h) => h.by !== "A" && h.by !== "P" && (!h.at.includes("T") || ms(h.at) < ms(enc.start)));
    const st = before[before.length - 1]?.status;
    return st === "active" || st === "held";
  });
}

// Riverside: documents; each re-lists home meds and allergies (T15); labs are copies (T14); UTC times (T10).
function riverside(p: Patient, t: number, e: Expected, ix: TrapIndex) {
  const docs = p.encounters.filter((x) => x.source === "A").flatMap((enc) => enc.documents.map((doc) => ({ enc, doc })))
    .filter((x) => ms(x.doc.signedAt) <= t).sort((a, b) => ms(a.doc.signedAt) - ms(b.doc.signedAt));
  if (!docs.length) return;
  const { enc, doc } = docs[docs.length - 1];
  const isDischarge = doc.kind === "discharge";

  // Home medication list of the latest document.
  const CLASS_SKIP = (m: Medication) => m.setting === "inpatient" || !m.visibility.A || m.otc;
  for (const m of p.meds) {
    if (CLASS_SKIP(m)) continue;
    const before = m.history.filter((h) => h.by !== "A" && h.by !== "P" && (!h.at.includes("T") || ms(h.at) < ms(enc.start)));
    const st0 = before[before.length - 1]?.status;
    if (st0 !== "active" && st0 !== "held") continue;
    const aEntries = m.history.filter((h) => h.by === "A" && ms(h.at) <= ms(doc.signedAt) && ms(h.at) >= ms(enc.start));
    const last = aEntries[aEntries.length - 1];
    const status = !last ? (isDischarge ? "active" : "unknown") : last.status === "held" ? "held" : last.status === "stopped" ? "stopped" : "active";
    const d = medDoseAt(p, m.id, last?.dose ? doc.signedAt : enc.start);
    e.medications.push(row("medications", {
      ingredient: d.drug.ingredient, names: [`${d.drug.ingredient} ${d.drug.strength} mg ${d.drug.form}`], ingredientDerivable: true, status,
      dose: doseOf(d.dose), frequency: FREQ_OK[d.frequency], patient_reported: false,
    }, [m.id], "A", ix, modality(m, "A"), ["T15", ...(status === "held" ? ["T1"] : [])]));
  }

  // Allergies: the latest document's list, plus adverse drug effects recorded as diagnoses in any document.
  const seen = new Set<string>();
  for (const a of p.allergies.filter((x) => x.visibility.A && ms(x.recordedAt.includes("T") ? x.recordedAt : x.recordedAt + "T00:00:00Z") < ms(enc.start))) {
    seen.add(a.id);
    const sev = a.type === "intolerance" ? "mild" : a.criticality === "high" ? "severe" : "moderate";
    e.allergies.push(row("allergies", { substance: a.substance.display, reaction_type: RT[a.type], ...(sev !== "moderate" ? { criticality: a.criticality } : {}), reaction: words([a.reactions[0]]), mechanism: ["non_immune", "unknown"] } as AllergyKey, [a.id], "A", ix, modality(a, "A"), ["T18"]));
  }
  // Views v2: a diagnosis the source attributes to a drug class (SGLT2i-associated DKA, ACE-inhibitor
  // angioedema) also yields a row here. Substance: the one drug of that class on the same document's home
  // medication list if there is exactly one, else the class as written. The truth links the reaction to
  // the condition it caused (`manifestation`).
  const CLASS_OF: [RegExp, string[], string, ReactionType][] = [
    [/SGLT2 inhibitor-associated/i, ["sglt2i"], "SGLT2 inhibitor", "serious_adverse_event"],
    [/ACE inhibitor-associated/i, ["acei"], "ACE inhibitor", "hypersensitivity"],
  ];
  const doneCond = new Set<string>();
  for (const { enc: en, doc: d } of docs) for (const it of d.plan ?? []) {
    if (it.kind !== "dx" || doneCond.has(it.conditionId)) continue;
    const c = p.conditions.find((x) => x.id === it.conditionId)!;
    const hs = c.history.filter((h) => h.recordedBy === "A" && ms(h.at.includes("T") ? h.at : h.at + "T00:00:00Z") <= ms(d.signedAt));
    const label = [...hs].reverse().find((h) => h.label)?.label ?? c.name;
    const st = hs[hs.length - 1]?.status;
    const cls = CLASS_OF.find(([re]) => re.test(label) || (re.source.startsWith("SGLT2") && hs.some((h) => h.subtype === "sglt2i")));
    if (!cls || st === "working" || st === "ruled-out") continue;
    doneCond.add(c.id);
    const onList = homeList(p, en).filter((m) => cls[1].includes(drug(m.product).klass));
    const substance = onList.length === 1 ? drug(onList[0].product).ingredient : cls[2];
    const a = p.allergies.find((x) => x.manifestation === c.id);
    if (a && seen.has(a.id)) continue;
    if (a) seen.add(a.id);
    // One row per substance: a substance already on the allergy list is not repeated.
    if (e.allergies.some((x) => x.fields.substance === substance)) continue;
    e.allergies.push(row("allergies", { substance, reaction_type: cls[3], mechanism: ["non_immune", "unknown"] } as AllergyKey, a ? [a.id, c.id] : [c.id], "A", ix, a ? modality(a, "A") : "structured", ["T18"]));
  }
  for (const { doc: d } of docs) for (const it of d.plan ?? []) {
    if (it.kind !== "adverse-dx" || seen.has(it.allergyId)) continue;
    seen.add(it.allergyId);
    const a = p.allergies.find((x) => x.id === it.allergyId)!;
    e.allergies.push(row("allergies", { substance: a.substance.display, reaction_type: RT[a.type], mechanism: ["non_immune", "unknown"] } as AllergyKey, [a.id], "A", ix, modality(a, "A"), ["T18"]));
  }

  // Problems: latest appearance of each condition in any document's diagnosis or history list.
  const appear = new Map<string, { status: string; label: string }>();
  for (const { doc: d } of docs) for (const it of d.plan ?? []) {
    if (it.kind === "dx") {
      const c = p.conditions.find((x) => x.id === it.conditionId)!;
      const hs = c.history.filter((h) => h.recordedBy === "A" && ms(h.at.includes("T") ? h.at : h.at + "T00:00:00Z") <= ms(d.signedAt));
      appear.set(c.id, { status: hs[hs.length - 1]?.status ?? "active", label: [...hs].reverse().find((h) => h.label)?.label ?? c.name });
    } else if (it.kind === "history") {
      const c = p.conditions.find((x) => x.id === it.conditionId)!;
      appear.set(c.id, { status: "active", label: it.label ?? c.name });
    }
  }
  for (const [cid, a] of appear) {
    const c = p.conditions.find((x) => x.id === cid)!;
    const icd = c.coding.find((x) => x.system === "icd10")!.code;
    if (a.status === "ruled-out" || a.status === "working") {
      e.anti.push(row("problems", { reason: `diagnosis ${a.status} in the latest document that lists it`, family: family(icd, a.label), condition: a.label }, [c.id], "A", ix, "narrated", ["T12"]));
      continue;
    }
    e.problems.push(row("problems", { family: family(icd, a.label), condition: a.label, icd10: icd, status: a.status === "resolved" ? "resolved" : "active" } as ProblemKey, [c.id], "A", ix, modality(c, "A")));
  }

  // Labs: every result copied into an in-scope document, once.
  const labIds = new Set<string>();
  for (const { doc: d } of docs) for (const it of d.plan ?? []) if (it.kind === "lab") for (const id of it.labIds) labIds.add(id);
  for (const id of labIds) {
    const l = p.labs.find((x) => x.id === id)!;
    const a = analyteName(l.analyte);
    const final = docs.some(({ doc: d }) => (d.plan ?? []).some((it) => it.kind === "lab" && it.labIds.includes(id)) && (!l.finalAt || ms(d.signedAt) >= ms(l.finalAt)));
    e.labs.push(row("labs", {
      analyte: a, value: round(l.value, DEC_A[l.analyte] ?? 1), ...(l.comparator ? { comparator: l.comparator } : {}), unit: UNIT[a], collected: l.collectedAt,
      ...(a === "egfr" ? { egfr_equation: "ckd-epi-2021" } : {}), status: final ? "final" : "preliminary",
    }, [l.id], "A", ix, modality(l, "A"), ["T14", "T10"]));
  }

  // Vitals.
  const vids = new Set<string>();
  for (const { doc: d } of docs) for (const it of d.plan ?? []) if (it.kind === "vitals") vids.add(it.vitalId);
  for (const id of vids) {
    const v = p.vitals.find((x) => x.id === id)!;
    e.vitals.push(row("vitals", {
      setting: "hospital", local_time: wall(v.at), ...(v.bp ? { systolic_mmhg: v.bp.systolic, diastolic_mmhg: v.bp.diastolic } : {}),
      ...(v.pulse !== undefined ? { pulse_bpm: v.pulse } : {}), ...(v.weightKg !== undefined ? { weight_kg: v.weightKg } : {}),
    } as VitalKey, [v.id], "A", ix, "structured", ["T10"]));
  }
}

// HomeLog: day pages (supersede on edit) and My Medicines saves (each restates the list).
const BRAND_OK = (name: string, ingredient: string, brand?: string) => {
  const n = name.toLowerCase();
  return n.includes(ingredient.split(" ").slice(-1)[0]) || (!!brand && n.includes(brand.toLowerCase()));
};

/** Views v2 dose rule for a patient's list entry: count x strength; no count named = 1; ranges and conditions omit. */
function homeDose(strength?: string, how?: string): { value: number; unit: string } | undefined {
  if (!strength) return undefined;
  if (/ if | or |sliding/i.test(how ?? "")) return undefined;
  const units = (how ?? "").match(/^(\d+(?:\.\d+)?) units\b/);
  if (/pen/i.test(strength)) return units ? { value: +units[1], unit: "units" } : undefined;
  const mg = strength.match(/^(\d+(?:\.\d+)?) mg$/);
  if (!mg) return undefined;
  const count = (how ?? "").match(/^(\d+)\b(?! units)/);
  return { value: +mg[1] * (count ? +count[1] : 1), unit: "mg" };
}

function homelog(p: Patient, t: number, e: Expected, ix: TrapIndex) {
  const plan = p.home;
  if (!plan) return;
  const saves = plan.listSaves.filter((s) => (ix.itemRecorded?.get(`P|P/meds/${s.at}`) ?? ms(localAt(`${s.at}T00:00`))) <= t);
  const save = saves[saves.length - 1];
  if (save) save.entries.forEach((en, i) => {
    const m = p.meds.find((x) => x.id === en.medId)!;
    const d = drug(m.product);
    // HomeLog has no paused status: a paused drug left as 'taking' with a note saying so is held by the patient's account.
    const paused = en.status === "taking" && /stop for now|on hold|paused/i.test(en.note ?? "");
    e.medications.push(row("medications", {
      ingredient: d.ingredient, names: [en.name], ingredientDerivable: !!en.picked || BRAND_OK(en.name, d.ingredient, d.brand),
      status: en.status === "stopped" ? "stopped" : paused ? "held" : "active", status_since: en.status === "stopped" ? en.stopped : undefined,
      dose: homeDose(en.strengthText, en.howITakeIt), patient_reported: true, otc: !!m.otc,
    }, [m.id], "P", ix, modality(m, "P"), [...(m.otc ? ["T13"] : []), ...(paused ? ["T1"] : [])]));
    // Two entries for one ingredient on one list: a current entry beats a stopped one; then the later start date; then list position.
    e.medications[e.medications.length - 1].order = (en.status === "stopped" ? 0 : 1e13) + (en.started ? sortKey(en.started) / 1e3 : 0) + i;
  });
  for (const v of p.vitals.filter((x) => x.source === "P" && ms(x.at) <= t)) {
    const typoLive = v.typo && ms(localAt(`${v.typo.fixedAt.slice(0, 10)}T00:00`)) > t;
    if (v.duplicateOf) {
      e.anti.push(row("vitals", { reason: "typed duplicate of a device reading", setting: "home", local_time: wall(v.at), ...(v.bp ? { systolic_mmhg: v.bp.systolic } : {}), ...(v.glucose ? { glucose_mg_dl: v.glucose } : {}) }, [v.id], "P", ix, "structured", ["T14"]));
      continue;
    }
    if (v.kind === "home-glucose") {
      const mmol = v.renderedUnit === "mmol/L";
      const g = v.glucose! > 600 ? 600 : v.glucose! < 20 ? 20 : mmol ? Math.round(Math.round((v.glucose! / MGDL_PER_MMOL_GLUCOSE) * 10) / 10 * MGDL_PER_MMOL_GLUCOSE) : v.glucose!;
      e.vitals.push(row("vitals", { setting: "home", local_time: wall(v.at), glucose_mg_dl: g } as VitalKey, [v.id], "P", ix, "structured", mmol ? ["T6"] : []));
    } else {
      const bp = typoLive ? { ...v.bp!, ...v.typo } : v.bp!;
      if (v.typo && !typoLive) e.anti.push(row("vitals", { reason: "typo corrected on a superseding day page", setting: "home", local_time: wall(v.at), systolic_mmhg: v.typo.systolic ?? bp.systolic, diastolic_mmhg: v.typo.diastolic ?? bp.diastolic }, [v.id], "P", ix, "structured", ["T14"]));
      e.vitals.push(row("vitals", { setting: "home", local_time: wall(v.at), systolic_mmhg: bp.systolic, diastolic_mmhg: bp.diastolic, ...(v.pulse !== undefined ? { pulse_bpm: v.pulse } : {}) } as VitalKey, [v.id], "P", ix, "structured", v.typo ? ["T14"] : []));
    }
  }
}

// ─── Condition families (used to match problem rows) ──────────────────────────────────────────────

const ICD_FAMILY: [RegExp, string][] = [
  [/^I1[0-3]/, "hypertension"], [/^E1[013]\.1/, "dka"], [/^E11/, "type 2 diabetes"], [/^N18/, "ckd"], [/^E78/, "hyperlipidemia"],
  [/^F3[23]/, "depression"], [/^E66/, "obesity"], [/^I50/, "heart failure"], [/^M10/, "gout"], [/^M17/, "knee osteoarthritis"],
  [/^E03/, "hypothyroidism"], [/^E87\.1/, "hyponatremia"], [/^E87\.5/, "hyperkalemia"], [/^N17/, "aki"], [/^K85/, "pancreatitis"],
  [/^I2[0-5]/, "acs"], [/^J1[2-8]/, "pneumonia"], [/^T78\.3/, "angioedema"], [/^F41/, "anxiety"],
];
const TEXT_FAMILY: [RegExp, string][] = [
  [/ketoacidosis|\bDKA\b/i, "dka"], [/hypertensi|\bHTN\b/i, "hypertension"], [/kidney disease|\bCKD\b/i, "ckd"], [/type 2 diabetes|\bT2DM\b|diabetes mellitus/i, "type 2 diabetes"],
  [/hyperlipid|dyslipid|cholesterol/i, "hyperlipidemia"], [/depress/i, "depression"], [/obes/i, "obesity"], [/heart failure|HFrEF/i, "heart failure"],
  [/gout/i, "gout"], [/osteoarthritis/i, "knee osteoarthritis"], [/hypothyroid/i, "hypothyroidism"], [/hyponatr/i, "hyponatremia"],
  [/hyperkal/i, "hyperkalemia"], [/acute kidney injury|\bAKI\b/i, "aki"], [/pancreatitis/i, "pancreatitis"], [/coronary|\bACS\b|chest pain/i, "acs"],
  [/pneumonia/i, "pneumonia"], [/angioedema/i, "angioedema"], [/anxiety/i, "anxiety"],
];

/** A coarse condition identity: ICD-10 code family first, then wording, then the 3-character category. */
export function family(icd10: string | undefined, text: string | undefined): string {
  if (icd10) for (const [re, f] of ICD_FAMILY) if (re.test(icd10)) return f;
  if (text) for (const [re, f] of TEXT_FAMILY) if (re.test(text)) return f;
  if (icd10) return icd10.slice(0, 3);
  return (text ?? "").toLowerCase().trim();
}

export { inZone };

// ─── Merged (end-to-end) key ───────────────────────────────────────────────────────────────────────

/**
 * The merged chart key from the truth's answer keys (packages/truth/src/keys.ts), in the same row form.
 * Medications: active and held only (the merged view the consumer shows). eGFR: the value as reported
 * under the views' eGFR rule (the non-race variant on CKD-EPI 2009 rows), since the truth's recomputed
 * CKD-EPI 2021 value for old rows needs demographics no mapper is given.
 */
export function mergedExpected(p: Patient, keys: Record<string, any>, ix: TrapIndex): Expected {
  const e: Expected = { medications: [], problems: [], allergies: [], labs: [], vitals: [], anti: [] };
  const traps = (ids: string[]) => [...new Set(ids.flatMap((id) => [...(ix.fact.get(id) ?? [])]))].sort((a, b) => +a.slice(1) - +b.slice(1));
  const mk = <F>(view: KeyRow<F>["view"], fields: F, basis: string[]): KeyRow<F> => ({ view, fields, basis, traps: traps(basis), modality: "structured" });
  for (const m of keys["active-meds"]) e.medications.push(mk("medications", {
    ingredient: m.medication, names: [m.product], ingredientDerivable: true, status: m.status, status_since: m.status === "held" ? m.since : undefined, dose: doseOf(m.dose ?? undefined),
  } as MedKey, m.basis));
  for (const [list, status] of [["active", "active"], ["resolved", "resolved"]] as const) for (const c of keys.problems[list]) e.problems.push(mk("problems", {
    family: family(c.icd10, c.condition), condition: c.condition, icd10: c.icd10, status, ...(/^N18/.test(c.icd10) ? { ckd_stage: stageOf(c.stage).ckd_stage } : {}), onset: c.onset,
  } as ProblemKey, c.basis));
  for (const a of keys.allergies) e.allergies.push(mk("allergies", { substance: a.substance, reaction_type: RT[a.type], criticality: a.criticality, mechanism: ["non_immune", "unknown"] } as AllergyKey, a.basis));
  for (const [analyte, series] of Object.entries(keys["lab-series"]) as [string, any[]][]) for (const l of series) {
    const a = analyteName(analyte);
    let value = l.value, comparator = l.comparator, eq: string | undefined;
    if (a === "egfr") {
      const rep = (l.reported ?? []).find((r: any) => r.equation === "ckd-epi-2009-nonaa") ?? (l.reported ?? []).find((r: any) => r.equation === "ckd-epi-2021");
      if (rep) { value = rep.value; comparator = rep.comparator; eq = rep.equation === "ckd-epi-2021" ? "ckd-epi-2021" : "ckd-epi-2009"; } else eq = "ckd-epi-2021";
    }
    e.labs.push(mk("labs", { analyte: a, value, ...(comparator ? { comparator } : {}), unit: UNIT[a], collected: l.collected, ...(eq ? { egfr_equation: eq } : {}) } as LabKey, l.basis));
  }
  const v = keys.vitals;
  const finish = () => restrictToRecords(p, e, ix);
  for (const [list, setting] of [["clinic", "clinic"], ["hospital", "hospital"], ["home_bp", "home"], ["home_glucose", "home"]] as const) for (const x of v[list]) e.vitals.push(mk("vitals", {
    setting, local_time: x.local_time, ...(x.systolic !== undefined ? { systolic_mmhg: x.systolic, diastolic_mmhg: x.diastolic } : {}),
    ...(x.repeat ? { repeat_systolic_mmhg: x.repeat.systolic, repeat_diastolic_mmhg: x.repeat.diastolic } : {}), ...(x.pulse !== undefined ? { pulse_bpm: x.pulse } : {}),
    ...(x.weight_kg !== undefined ? { weight_kg: x.weight_kg } : {}), ...(x.glucose_mg_dl !== undefined ? { glucose_mg_dl: Math.min(600, x.glucose_mg_dl) } : {}),
  } as VitalKey, x.basis));
  return finish();
}

/**
 * The merged key restricted to what the records carry: a fact no source renders is dropped, and a
 * field (dose, onset, CKD stage, status date, criticality) is scored only if some source's own key
 * carries it for that fact.
 */
function restrictToRecords(p: Patient, e: Expected, ix: TrapIndex): Expected {
  const per = (Object.keys(SOURCE_KEY) as string[]).filter((s) => p.sources[SOURCE_KEY[s]]).map((s) => expectedFor(p, s, "2026-10-13", ix));
  const views = ["medications", "problems", "allergies", "labs", "vitals"] as const;
  for (const view of views) {
    const src = per.flatMap((x) => x[view] as KeyRow<any>[]);
    (e as any)[view] = (e[view] as KeyRow<any>[]).flatMap((r) => {
      const same = src.filter((x) => x.basis.some((b) => r.basis.includes(b)));
      if (!same.length) return [];
      const f = { ...r.fields };
      for (const k of ["dose", "onset", "ckd_stage", "status_since", "criticality", "frequency"]) if (k in f && !same.some((x) => x.fields[k] !== undefined)) delete f[k];
      return [{ ...r, fields: f }];
    });
  }
  return e;
}
