// Hand-written reference mapper for Northgate (written by the harness author from the schema, not by an
// agent). Used only to check that the per-source keys and the scorer agree with a careful reading of
// the schema, and as the base for deliberately broken variants in the scorer tests.
import type { FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow, LabResultRow, VitalRow } from "../in/views/views";

const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
function local(iso: string): string {
  const p = Object.fromEntries(fmt.formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}
const localDay = (iso: string) => (iso.includes("T") ? local(iso).slice(0, 10) : iso);

const SALT = /\b(hydrochloride|potassium|sodium|succinate|calcium|maleate)\b/g;
function ingredientOf(name: string): string {
  let n = name.toLowerCase().replace(/^\d+(\.\d+)?\s*ml\s+/, "").replace(/^24 hr\s+/, "");
  n = n.split(/\s\d/)[0].replace(SALT, "").replace(/\s+/g, " ").trim();
  return n;
}

const CODE: Record<string, string> = {
  "LK-CREAT": "creatinine", "LK-EGFR09N": "egfr", "LK-EGFR21": "egfr", "LK-NA": "sodium", "LK-K": "potassium", "LK-GLU": "glucose", "LK-A1C": "a1c",
  "LK-UACR": "uacr", "LK-WBC": "wbc", "LK-HGB": "hemoglobin", "LK-PLT": "platelets", "LK-CHOL": "cholesterol", "LK-TRIG": "triglycerides", "LK-HDL": "hdl", "LK-LDLC": "ldl",
};
const UNITS: Record<string, string> = { creatinine: "mg/dL", egfr: "mL/min/1.73m2", sodium: "mmol/L", potassium: "mmol/L", glucose: "mg/dL", a1c: "%", uacr: "mg/g", wbc: "10*3/uL", hemoglobin: "g/dL", platelets: "10*3/uL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL" };

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const inScope = items.filter((i) => localDay(i.recorded) <= asOf);
  const dead = new Set<string>();
  for (const i of inScope) for (const id of [...(i.supersedes ?? []), ...(i.retracts ?? [])]) dead.add(id);
  const cur = inScope.filter((i) => !dead.has(i.id)).sort((a, b) => Date.parse(a.effective) - Date.parse(b.effective) || a.recorded.localeCompare(b.recorded));
  const entries = cur.flatMap((i) => Object.entries(i.payload ?? {}).map(([k, e]) => ({ item: i, key: k, e: e as any })));

  // Medications.
  const lines = new Map<string, typeof entries>();
  for (const x of entries.filter((x) => x.e.type === "med_event")) lines.set(x.e.med_id, [...(lines.get(x.e.med_id) ?? []), x]);
  const byIng = new Map<string, MedicationRow & { _t: number }>();
  for (const evs of lines.values()) {
    const last = evs[evs.length - 1];
    const e = last.e;
    const status = e.action === "stop" ? "stopped" : e.action === "hold" ? "held" : "active";
    let since: string | undefined;
    if (status !== "active") { let i = evs.length - 1; while (i > 0 && evs[i - 1].e.action === e.action) i--; since = localDay(evs[i].item.effective); }
    const ing = ingredientOf(e.drug.name);
    const row: MedicationRow & { _t: number } = {
      ingredient: ing, drug_name: e.drug.name, status, ...(since ? { status_since: since } : {}),
      ...(e.dose ? { dose: { value: e.dose.value, unit: e.dose.unit === "units" ? "units" : e.dose.unit === "tab" ? "tablet" : e.dose.unit } } : {}),
      ...(e.frequency ? { frequency: e.frequency === "OTHER" ? "other" : e.frequency } : {}),
      ...(status === "stopped" && e.stop_reason ? { stop_reason: e.stop_reason } : {}), ...(e.reason_text ? { status_reason_text: e.reason_text } : {}),
      patient_reported: false, evidence: evs.map((x) => ({ item_id: x.item.id, entry_id: x.key })), _t: Date.parse(last.item.effective),
    };
    const prev = byIng.get(ing);
    if (!prev || prev._t < row._t) byIng.set(ing, row);
  }
  const medications = [...byIng.values()].map(({ _t, ...r }) => r);

  // Problems.
  const probs = new Map<string, typeof entries>();
  for (const x of entries.filter((x) => x.e.type === "problem_event")) probs.set(x.e.problem_id, [...(probs.get(x.e.problem_id) ?? []), x]);
  const problems: ProblemRow[] = [];
  for (const evs of probs.values()) {
    const e = evs[evs.length - 1].e;
    if (e.action === "remove") continue;
    const st = String(e.description).match(/stage (\d[ab]?)/i)?.[1];
    problems.push({
      condition: e.description, icd10cm: e.icd10cm, ...(e.snomed ? { snomed: e.snomed } : {}), status: e.action === "resolve" ? "resolved" : "active",
      ...(e.onset ? { onset: { value: e.onset.precision === "year" ? e.onset.date.slice(0, 4) : e.onset.precision === "month" ? e.onset.date.slice(0, 7) : e.onset.date, precision: e.onset.precision } } : {}),
      ...(/^N18/.test(e.icd10cm) && st ? { ckd_stage: `G${st}` as ProblemRow["ckd_stage"] } : {}),
      evidence: evs.map((x) => ({ item_id: x.item.id, entry_id: x.key })),
    });
  }

  // Allergies.
  const algs = new Map<string, typeof entries>();
  for (const x of entries.filter((x) => x.e.type === "allergy_event")) algs.set(x.e.allergy_id, [...(algs.get(x.e.allergy_id) ?? []), x]);
  const allergies: AllergyIntoleranceRow[] = [];
  for (const evs of algs.values()) {
    const e = evs[evs.length - 1].e;
    if (e.action === "inactivate") continue;
    allergies.push({
      substance: String(e.substance.name).toLowerCase(), ...(e.substance.rxnorm ? { rxnorm_ingredient: e.substance.rxnorm } : {}), type: e.reaction_type,
      reaction: (e.reactions ?? []).join("; "), criticality: e.severity,
      ...(e.onset ? { onset: { value: e.onset.precision === "year" ? e.onset.date.slice(0, 4) : e.onset.precision === "month" ? e.onset.date.slice(0, 7) : e.onset.date, precision: e.onset.precision } } : {}),
      evidence: evs.map((x) => ({ item_id: x.item.id, entry_id: x.key })),
    });
  }

  // Labs.
  const labs: LabResultRow[] = [];
  for (const x of entries.filter((x) => x.e.type === "imported_result")) {
    const e = x.e;
    const analyte = CODE[e.external_ref?.result_code];
    if (!analyte) continue;
    const m = String(e.value).trim().match(/^(<=|>=|<|>)?\s*(-?\d+(?:\.\d+)?)$/);
    if (!m || e.result_status === "C" && !m) continue;
    let value = Number(m[2]);
    if (e.unit === "cells/uL") value = value / 1000;
    labs.push({
      analyte: analyte as LabResultRow["analyte"], value, ...(m[1] ? { comparator: m[1] as LabResultRow["comparator"] } : {}), unit: UNITS[analyte], collected: e.collected,
      status: e.result_status === "P" ? "preliminary" : "final",
      ...(analyte === "egfr" ? { egfr_equation: e.external_ref.result_code === "LK-EGFR21" ? "ckd-epi-2021" : "ckd-epi-2009" } : {}),
      ...(e.test.loinc ? { loinc: e.test.loinc } : {}), evidence: [{ item_id: x.item.id, entry_id: x.key }],
    });
  }

  // Vitals.
  const vitals: VitalRow[] = [];
  for (const x of entries.filter((x) => x.e.type === "vital_set")) {
    const e = x.e;
    const bp = e.bp?.split("/").map(Number), rp = e.bp_repeat?.split("/").map(Number);
    vitals.push({
      setting: "clinic", local_time: local(x.item.effective), ...(bp ? { systolic_mmhg: bp[0], diastolic_mmhg: bp[1] } : {}),
      ...(rp ? { repeat_systolic_mmhg: rp[0], repeat_diastolic_mmhg: rp[1] } : {}), ...(e.pulse_bpm !== undefined ? { pulse_bpm: e.pulse_bpm } : {}),
      ...(e.weight_lb !== undefined ? { weight_kg: Math.round(e.weight_lb * 0.45359237 * 10) / 10 } : {}), evidence: [{ item_id: x.item.id, entry_id: x.key }],
    });
  }
  return { medications, problems, allergies, labs, vitals };
}
