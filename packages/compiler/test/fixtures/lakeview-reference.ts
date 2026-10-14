// Hand-written reference mapper for Lakeview (harness author, from the schema). Key and scorer check only.
import type { FolioItem, ViewRows, MedicationRow, ProblemRow, LabResultRow, VitalRow } from "../in/views/views";

const fmt = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
function local(iso: string): string {
  const p = Object.fromEntries(fmt.formatToParts(new Date(iso)).map((x) => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}
const localDay = (iso: string) => (iso.includes("T") ? local(iso).slice(0, 10) : iso);
const CODE: Record<string, string> = {
  "LK-CREAT": "creatinine", "LK-EGFR09N": "egfr", "LK-EGFR21": "egfr", "LK-NA": "sodium", "LK-K": "potassium", "LK-GLU": "glucose", "LK-A1C": "a1c",
  "LK-UACR": "uacr", "LK-WBC": "wbc", "LK-HGB": "hemoglobin", "LK-PLT": "platelets", "LK-CHOL": "cholesterol", "LK-TRIG": "triglycerides", "LK-HDL": "hdl", "LK-LDLC": "ldl",
};
const UNITS: Record<string, string> = { creatinine: "mg/dL", egfr: "mL/min/1.73m2", sodium: "mmol/L", potassium: "mmol/L", glucose: "mg/dL", a1c: "%", uacr: "mg/g", wbc: "10*3/uL", hemoglobin: "g/dL", platelets: "10*3/uL", cholesterol: "mg/dL", triglycerides: "mg/dL", hdl: "mg/dL", ldl: "mg/dL" };
const STATUS: Record<number, MedicationRow["status"] | undefined> = { 1: "active", 2: "stopped", 3: "held" };

export function transform(items: FolioItem[], asOf: string): ViewRows {
  const inScope = items.filter((i) => localDay(i.recorded) <= asOf);
  const dead = new Set<string>();
  for (const i of inScope) for (const id of [...(i.supersedes ?? []), ...(i.retracts ?? [])]) dead.add(id);
  const cur = inScope.filter((i) => !dead.has(i.id)).sort((a, b) => Date.parse(a.effective) - Date.parse(b.effective));
  const rows = cur.flatMap((i) => Object.entries(i.payload ?? {}).map(([k, e]) => ({ item: i, key: k, e: e as any })));

  // Medications: MED_ORDER + latest MED_STATUS_HIST per RX_ID.
  const medications: MedicationRow[] = [];
  for (const o of rows.filter((x) => x.e.type === "MED_ORDER")) {
    const hist = rows.filter((x) => x.e.type === "MED_STATUS_HIST" && x.e.RX_ID === o.e.RX_ID).sort((a, b) => Date.parse(a.e.CHANGED_AT) - Date.parse(b.e.CHANGED_AT));
    const code = hist.length ? hist[hist.length - 1].e.NEW_STATUS : o.e.MED_STATUS;
    const status = STATUS[code];
    if (!status || o.e.MED_STATUS === 9) continue;
    let since: string | undefined;
    if (status !== "active" && hist.length) { let i = hist.length - 1; while (i > 0 && hist[i - 1].e.NEW_STATUS === code) i--; since = localDay(hist[i].e.CHANGED_AT); }
    medications.push({
      ingredient: String(o.e.DRUG_NAME).toLowerCase().split(/\s\d/)[0], drug_name: o.e.DRUG_NAME, status, ...(since ? { status_since: since } : {}),
      dose: { value: o.e.DOSE_QTY, unit: o.e.DOSE_UNIT === "unit" ? "units" : o.e.DOSE_UNIT }, frequency: o.e.FREQ_CODE, patient_reported: false,
      evidence: [o, ...hist].map((x) => ({ item_id: x.item.id, entry_id: x.key })),
    });
  }

  // Problems: latest VISIT_DX per code; 'R'/'P' are not problems; CKD stage from the latest CKD_G.
  const visits = rows.filter((x) => x.e.type === "CLINIC_VISIT").sort((a, b) => Date.parse(a.e.VISIT_AT) - Date.parse(b.e.VISIT_AT));
  const g = [...visits].reverse().find((v) => v.e.CKD_G)?.e;
  const at = new Map(visits.map((v) => [v.e.VISIT_ID, Date.parse(v.e.VISIT_AT)]));
  const dx = new Map<string, (typeof rows)[number]>();
  for (const x of rows.filter((x) => x.e.type === "VISIT_DX").sort((a, b) => (at.get(a.e.VISIT_ID) ?? 0) - (at.get(b.e.VISIT_ID) ?? 0))) dx.set(String(x.e.ICD10CM).slice(0, 3), x);
  const problems: ProblemRow[] = [];
  for (const x of dx.values()) {
    if (x.e.DX_STATUS === "R" || x.e.DX_STATUS === "P") continue;
    problems.push({
      condition: x.e.DX_TEXT, icd10cm: x.e.ICD10CM, status: x.e.DX_STATUS === "H" ? "resolved" : "active",
      ...(/^N18/.test(x.e.ICD10CM) && g ? { ckd_stage: g.CKD_G, ...(g.CKD_A ? { albuminuria: g.CKD_A } : {}) } : {}),
      evidence: [{ item_id: x.item.id, entry_id: x.key }],
    });
  }

  // Labs.
  const orders = new Map(rows.filter((x) => x.e.type === "LAB_ORDER").map((x) => [x.e.ORDER_ID, x.e]));
  const reqAt = new Map(rows.filter((x) => x.e.type === "LAB_REQ").map((x) => [x.e.REQ_ID, x.e.COLLECTED_AT]));
  const labs: LabResultRow[] = [];
  for (const x of rows.filter((x) => x.e.type === "LAB_RESULT")) {
    const e = x.e, o = orders.get(e.ORDER_ID);
    const analyte = CODE[e.TEST_CODE];
    if (!analyte || !o || o.ORDER_STATUS === 9 || o.ORDER_STATUS === 5) continue;
    if (!["F", "A", "P"].includes(e.RESULT_STATUS)) continue;
    const m = String(e.VALUE_TEXT).trim().match(/^(<=|>=|<|>)?\s*(-?\d+(?:\.\d+)?)$/);
    if (!m) continue;
    labs.push({
      analyte: analyte as LabResultRow["analyte"], value: Number(m[2]), ...(m[1] ? { comparator: m[1] as LabResultRow["comparator"] } : {}), unit: UNITS[analyte],
      collected: reqAt.get(o.REQ_ID) ?? x.item.effective, status: e.RESULT_STATUS === "P" ? "preliminary" : "final",
      ...(analyte === "egfr" ? { egfr_equation: e.TEST_CODE === "LK-EGFR21" ? "ckd-epi-2021" : "ckd-epi-2009" } : {}), evidence: [{ item_id: x.item.id, entry_id: x.key }],
    });
  }

  // Vitals: one row per contact.
  const vitals: VitalRow[] = [];
  for (const v of visits) {
    const vs = rows.filter((x) => x.e.type === "VITAL" && x.e.VISIT_ID === v.e.VISIT_ID);
    if (!vs.length) continue;
    const get = (c: string, n = 1) => vs.find((x) => x.e.VITAL_CODE === c && x.e.READING_NO === n)?.e;
    const first = get("BPS") ?? vs[0].e;
    vitals.push({
      setting: "clinic", local_time: local(first.TAKEN_AT),
      ...(get("BPS") ? { systolic_mmhg: get("BPS")!.VALUE_NUM, diastolic_mmhg: get("BPD")!.VALUE_NUM } : {}),
      ...(get("BPS", 2) ? { repeat_systolic_mmhg: get("BPS", 2)!.VALUE_NUM, repeat_diastolic_mmhg: get("BPD", 2)!.VALUE_NUM } : {}),
      ...(get("HR") ? { pulse_bpm: get("HR")!.VALUE_NUM } : {}), ...(get("WT") ? { weight_kg: get("WT")!.VALUE_NUM } : {}),
      evidence: vs.map((x) => ({ item_id: x.item.id, entry_id: x.key })),
    });
  }
  return { medications, problems, allergies: [], labs, vitals };
}
