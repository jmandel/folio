// Hand-written reference mapper for Riverside (harness author, from the schema). Key and scorer check only.
import type { FolioItem, ViewRows, MedicationRow, ProblemRow, AllergyIntoleranceRow, LabResultRow, VitalRow } from "../in/views/views";

const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
function local(iso: string): string {
  const p = Object.fromEntries(fmt.formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}
const localDay = (iso: string) => (iso.includes("T") ? local(iso).slice(0, 10) : iso);
const CODE: Record<string, string> = {
  NA: "sodium", K: "potassium", CL: "chloride", CO2: "bicarbonate", AGAP: "anion_gap", BUN: "bun", CREAT: "creatinine", EGFR: "egfr", GLU: "glucose", VPH: "ph",
  VPCO2: "pco2", BHB: "bhb", TROPI: "troponin", LIPASE: "lipase", WBC: "wbc", HGB: "hemoglobin", PLT: "platelets", A1C: "a1c", UACR: "uacr", CHOL: "cholesterol",
  TRIG: "triglycerides", HDL: "hdl", LDLC: "ldl",
};
const UNITS: Record<string, string> = {
  sodium: "mmol/L", potassium: "mmol/L", chloride: "mmol/L", bicarbonate: "mmol/L", anion_gap: "mmol/L", bun: "mg/dL", creatinine: "mg/dL", egfr: "mL/min/1.73m2", glucose: "mg/dL",
  ph: "[pH]", pco2: "mmHg", bhb: "mmol/L", troponin: "ng/mL", lipase: "U/L", wbc: "10*3/uL", hemoglobin: "g/dL", platelets: "10*3/uL", a1c: "%", uacr: "mg/g",
  cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL",
};
const FREQ: [RegExp, MedicationRow["frequency"]][] = [[/\bBID\b/, "BID"], [/\bTID\b/, "TID"], [/nightly|QHS/i, "QHS"], [/weekly/i, "QW"], [/PRN/, "PRN"], [/daily/i, "QD"]];
const RANK: Record<string, number> = { preliminary: 0, final: 1, corrected: 2 };

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const inScope = items.filter((i) => localDay(i.recorded) <= asOf);
  const dead = new Set<string>();
  for (const i of inScope) for (const id of [...(i.supersedes ?? []), ...(i.retracts ?? [])]) dead.add(id);
  const docs = inScope.filter((i) => !dead.has(i.id)).sort((a, b) => Date.parse(a.recorded) - Date.parse(b.recorded));
  const last = docs[docs.length - 1];
  if (!last) return { medications: [], problems: [], allergies: [], labs: [], vitals: [] };
  const lastKind = Object.values(last.payload).find((e: any) => e.type === "encounter")?.document_kind;

  const medications: MedicationRow[] = [];
  for (const [k, e] of Object.entries(last.payload) as [string, any][]) {
    if (e.type !== "home_med") continue;
    const status: MedicationRow["status"] = e.status === "held" ? "held" : e.status === "stopped" ? "stopped" : e.status === "not_reconciled" ? "unknown" : "active";
    const dm = String(e.dose_text).match(/^([\d.]+)\s*(mg|units?|mcg|mL)\b/);
    medications.push({
      ingredient: String(e.drug_name).toLowerCase().split(/\s\d/)[0].replace(/\s+pen$/, ""), drug_name: e.drug_name, ...(e.rxnorm_ingredient ? { rxnorm_ingredient: e.rxnorm_ingredient } : {}), status,
      ...(dm ? { dose: { value: Number(dm[1]), unit: /^unit/.test(dm[2]) ? "units" : dm[2] as "mg" } } : {}), frequency: FREQ.find(([re]) => re.test(e.sig))?.[1],
      ...(e.instructions ? { status_reason_text: e.instructions } : {}), patient_reported: false, evidence: [{ item_id: last.id, entry_id: k }],
    });
  }
  void lastKind;

  const allergies: AllergyIntoleranceRow[] = [];
  for (const [k, e] of Object.entries(last.payload) as [string, any][]) {
    if (e.type !== "allergy" || e.substance === "NKDA") continue;
    const cough = /cough|nausea|upset|myalgia/i.test(e.reaction ?? "");
    const adverse = /ketoacidosis|dka|lactic|acidosis/i.test(e.reaction ?? "");
    allergies.push({
      substance: String(e.substance).toLowerCase(), ...(e.rxnorm_ingredient ? { rxnorm_ingredient: e.rxnorm_ingredient } : {}), reaction_type: adverse ? "serious_adverse_event" : cough ? "side_effect" : "hypersensitivity", mechanism: "unknown",
      ...(e.reaction ? { reaction: e.reaction } : {}), criticality: e.severity === "mild" ? "low" : e.severity === "severe" ? "high" : "unknown", evidence: [{ item_id: last.id, entry_id: k }],
    });
  }
  const problems = new Map<string, ProblemRow>();
  const ruledOut = new Set<string>();
  for (const d of docs) for (const [k, e] of Object.entries(d.payload) as [string, any][]) {
    if (e.type === "diagnosis") {
      const adv = String(e.label).match(/^Adverse effect of (.+)$/i);
      if (adv) {
        if (!allergies.some((a) => a.substance === adv[1].toLowerCase())) allergies.push({ substance: adv[1].toLowerCase(), reaction_type: "serious_adverse_event", mechanism: "unknown", criticality: "unknown", evidence: [{ item_id: d.id, entry_id: k }] });
        continue;
      }
      const cls = /SGLT2 inhibitor-associated/i.test(e.label) ? { re: /empagliflozin|dapagliflozin|canagliflozin/, text: "SGLT2 inhibitor" } : /ACE inhibitor-associated/i.test(e.label) ? { re: /lisinopril|enalapril/, text: "ACE inhibitor" } : undefined;
      if (cls && e.status !== "working" && e.status !== "ruled_out") {
        const same = (Object.values(d.payload) as any[]).filter((m) => m.type === "home_med" && cls.re.test(String(m.drug_name).toLowerCase()));
        const sub = same.length === 1 ? String(same[0].drug_name).toLowerCase().split(/\s\d/)[0] : cls.text;
        if (!allergies.some((a) => a.substance === sub)) allergies.push({ substance: sub, reaction_type: /angioedema/i.test(e.label) ? "hypersensitivity" : "serious_adverse_event", mechanism: "non_immune", reaction: e.label, criticality: "high", evidence: [{ item_id: d.id, entry_id: k }] });
      }
      const key = (e.icd10cm ?? e.label).slice(0, 3) + (/^E1[013]\.1/.test(e.icd10cm ?? "") ? ".1" : "");
      const fam = /pancreatitis/i.test(e.label) ? "K85" : key;
      if (e.status === "working" || e.status === "ruled_out") { problems.delete(fam); continue; }
      problems.set(fam, { condition: e.label, ...(e.icd10cm ? { icd10cm: e.icd10cm } : {}), status: e.status === "resolved" ? "resolved" : "active", evidence: [{ item_id: d.id, entry_id: k }] });
    } else if (e.type === "history") {
      const key = (e.icd10cm ?? e.condition).slice(0, 3);
      problems.set(key, { condition: e.condition, ...(e.icd10cm ? { icd10cm: e.icd10cm } : {}), status: "active", evidence: [{ item_id: d.id, entry_id: k }] });
    }
  }
  void ruledOut;

  const labs = new Map<string, LabResultRow & { _r: number }>();
  const vitals = new Map<string, VitalRow>();
  for (const d of docs) for (const [k, e] of Object.entries(d.payload) as [string, any][]) {
    const comps = e.type === "result" ? [e] : e.type === "panel" ? e.components : [];
    for (const c of comps) {
      const analyte = CODE[c.test?.local_code];
      const m = String(c.value).trim().match(/^(<=|>=|<|>)?\s*(-?\d+(?:\.\d+)?)$/);
      if (!analyte || !m) continue;
      const id = `${e.accession}|${c.test.local_code}`;
      const r = RANK[e.status] ?? 0;
      const prev = labs.get(id);
      if (prev && prev._r > r) continue;
      labs.set(id, {
        analyte: analyte as LabResultRow["analyte"], value: Number(m[2]), ...(m[1] ? { comparator: m[1] as LabResultRow["comparator"] } : {}), unit: UNITS[analyte], collected: e.collected,
        status: e.status === "preliminary" ? "preliminary" : "final", ...(analyte === "egfr" ? { egfr_equation: "ckd-epi-2021" } : {}), ...(c.test.loinc ? { loinc: c.test.loinc } : {}),
        evidence: [{ item_id: d.id, entry_id: k }], _r: r,
      });
    }
    if (e.type === "vitals" && !vitals.has(e.taken)) vitals.set(e.taken, {
      setting: "hospital", local_time: local(e.taken), ...(e.bp ? { systolic_mmhg: e.bp.systolic_mmhg, diastolic_mmhg: e.bp.diastolic_mmhg } : {}),
      ...(e.heart_rate_bpm !== undefined ? { pulse_bpm: e.heart_rate_bpm } : {}), ...(e.weight_kg !== undefined ? { weight_kg: e.weight_kg } : {}), evidence: [{ item_id: d.id, entry_id: k }],
    });
  }
  return { medications, problems: [...problems.values()], allergies, labs: [...labs.values()].map(({ _r, ...l }) => l), vitals: [...vitals.values()] };
}
