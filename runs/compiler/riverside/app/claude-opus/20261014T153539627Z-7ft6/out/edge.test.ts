import { transform } from "./transform.ts";
const base = (id: string, rec: string, payload: any, extra: any = {}) => ({ folio: "0.1", id, issuer: "x", patient: "p", effective: rec, recorded: rec, narrative: "", payload, ...extra });
const enc = (kind: string, encId = "E1", extra: any = {}) => ({ type: "encounter", encounter_id: encId, document_kind: kind, class: "inpatient", service: "HM", arrived: "2024-01-01T10:00:00Z", ...extra });
const items: any[] = [
  base("A", "2024-01-02T12:00:00Z", { enc: enc("hp"),
    h1: { type: "history", condition: "CKD stage 3a", icd10cm: "N18.31", onset_text: "2016", source: "patient" },
    h2: { type: "history", condition: "Major depressive disorder", onset_text: "~10 years", source: "patient" },
    d1: { type: "diagnosis", label: "Adverse effect of penicillins", icd10cm: "T36.0X5A", status: "active", rank: "secondary" },
    d2: { type: "diagnosis", label: "Urticaria due to amoxicillin", icd10cm: "L50.0", status: "active" },
    m1: { type: "home_med", drug_name: "amoxicillin 500 mg capsule", rxnorm_ingredient: "723", dose_text: "500 mg", sig: "1 cap PO every 8 hours", status: "stopped", instructions: "Stopped for hives" },
    m2: { type: "home_med", drug_name: "sertraline 50 mg tablet", rxnorm_ingredient: "36437", dose_text: "2 tablets", sig: "take 2 tablets nightly", status: "continue" },
    m3: { type: "home_med", drug_name: "albuterol 90 mcg/actuation inhaler", dose_text: "2 puffs", sig: "every 6 hours as needed", status: "continue" },
    a0: { type: "allergy", substance: "NKDA", severity: "unknown" },
    r1: { type: "result", test: { local_code: "TROP", loinc: "89579-7", name: "Troponin I hs" }, accession: "X1", collected: "2024-01-02T03:00:00", specimen: "serum", status: "preliminary", value: "12", unit: "ng/L" },
    p1: { type: "panel", panel: { local_code: "CBC", name: "CBC" }, accession: "X2", collected: "2024-01-02T03:00:00Z", specimen: "whole blood", status: "final",
      components: [{ test: { local_code: "PLT", loinc: "777-3", name: "Platelets" }, value: "350", unit: "10*3/uL" }, { test: { local_code: "WBC", loinc: "6690-2", name: "WBC" }, value: "Clumped, see comment", unit: "10*3/uL" }, { test: { local_code: "EGFRAA", loinc: "48643-1", name: "eGFR if African American" }, value: ">60", unit: "mL/min/1.73m2" }] },
    v1: { type: "vitals", taken: "2024-01-02T11:00:00Z", bp: { systolic_mmhg: 150, diastolic_mmhg: 90 }, heart_rate_bpm: 80 },
    v2: { type: "vitals", taken: "2024-01-02T11:10:00Z", bp: { systolic_mmhg: 140, diastolic_mmhg: 85 } },
  }),
  base("B", "2024-01-03T12:00:00Z", { enc: enc("progress_note"),
    r1: { type: "result", test: { local_code: "TROP", loinc: "89579-7", name: "Troponin I hs" }, accession: "X1", collected: "2024-01-02T03:00:00", specimen: "serum", status: "corrected", value: "<5", unit: "ng/L" },
    d3: { type: "diagnosis", label: "CKD stage 3b", icd10cm: "N18.32", status: "active" },
    al: { type: "allergy", substance: "penicillins", reaction: "hives, lip swelling", severity: "severe" },
  }),
  base("C", "2024-01-04T12:00:00Z", { enc: enc("progress_note"), d3: { type: "diagnosis", label: "CKD stage 4", status: "active" } }, { supersedes: ["B"] }),
  base("D", "2024-01-05T12:00:00Z", { enc: enc("progress_note") }, { retracts: ["C"] }),
  { junk: true }, null, base("E", "garbage", {}),
];
for (const d of ["2024-01-03", "2024-01-04", "2024-01-05"]) {
  const r = transform(items as any, d);
  console.log("####", d);
  for (const [k, v] of Object.entries(r)) for (const row of v as any[]) { const { evidence, ...rest } = row; console.log(k, JSON.stringify(rest), evidence.map((e: any) => e.item_id + ":" + e.entry_id).join(",")); }
}
