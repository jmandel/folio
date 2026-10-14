import { transform } from "./transform.ts";
const base = (id: string, rec: string, payload: any, extra: any = {}) => ({ folio: "0.1", id, issuer: "x", patient: "p", effective: rec, recorded: rec, narrative: "", payload, ...extra });
const enc = (kind: string) => ({ type: "encounter", encounter_id: "E1", document_kind: kind, class: "inpatient", service: "HM", arrived: "2024-01-01T10:00:00Z", discharged: "2024-01-03T18:00:00Z" });
const items: any[] = [
  null, 5, { id: "bad" },
  base("A", "2024-01-02T10:00:00Z", { enc: enc("hp"),
    m1: { type: "home_med", drug_name: "empagliflozin 10 mg tablet", rxnorm_ingredient: "1545653", dose_text: "10 mg", sig: "daily", status: "held" },
    d1: { type: "diagnosis", label: "Adverse effect of ACE inhibitor", icd10cm: "T46.4X5A", status: "active" },
    r1: { type: "result", test: { local_code: "TROPI", loinc: "10839-9", name: "Troponin I" }, accession: "Q1", collected: "2024-01-01T11:00:00Z", specimen: "serum", status: "preliminary", value: "<0.01", unit: "ng/mL" },
    p1: { type: "panel", panel: { local_code: "BMP", name: "BMP" }, accession: "Q2", collected: "2024-01-01T11:00:00Z", specimen: "serum", status: "final", components: [
      { test: { local_code: "EGFRB", name: "eGFR (CKD-EPI 2009) African American" }, value: ">60", unit: "mL/min/1.73m2" },
      { test: { local_code: "EGFRN", name: "eGFR (CKD-EPI 2009) non-African American" }, value: "55", unit: "mL/min/1.73m2" } ] },
    h1: { type: "history", condition: "CKD stage 3a", onset_text: "2016", source: "patient" },
    al: { type: "allergy", substance: "penicillins", reaction: "hives", severity: "moderate" },
  }),
  base("B", "2024-01-03T20:00:00Z", { enc: enc("discharge_summary"),
    m1: { type: "home_med", drug_name: "empagliflozin 10 mg tablet", rxnorm_ingredient: "1545653", dose_text: "10 mg", sig: "daily", status: "stopped", instructions: "Stopped because of DKA" },
    m2: { type: "home_med", drug_name: "insulin glargine 100 units/mL pen", rxnorm_ingredient: "274783", dose_text: "18 units", sig: "at bedtime", status: "new" },
    r1: { type: "result", test: { local_code: "TROPI", loinc: "10839-9", name: "Troponin I" }, accession: "Q1", collected: "2024-01-01T11:00:00Z", specimen: "serum", status: "corrected", value: "0.05", unit: "ng/mL" },
    al: { type: "allergy", substance: "NKDA", severity: "unknown" },
  }, { effective_end: "2024-01-03T18:00:00Z" }),
  base("C", "2024-01-04T20:00:00Z", { enc: enc("discharge_summary"),
    m1: { type: "home_med", drug_name: "empagliflozin 10 mg tablet", rxnorm_ingredient: "1545653", dose_text: "10 mg", sig: "daily", status: "stopped", instructions: "Stopped because of DKA" },
    m2: { type: "home_med", drug_name: "insulin glargine 100 units/mL pen", rxnorm_ingredient: "274783", dose_text: "20 units", sig: "at bedtime", status: "new" },
    al: { type: "allergy", substance: "NKDA", severity: "unknown" },
  }, { supersedes: ["B"], effective_end: "2024-01-03T18:00:00Z" }),
];
console.log(JSON.stringify(transform(items as any, "2024-02-01"), null, 1));
console.log(JSON.stringify(transform([] as any, "2024-02-01")));
