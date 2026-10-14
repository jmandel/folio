import { transform } from "./transform.ts";
const base = (id: string, rec: string, payload: any, extra: any = {}) => ({ folio: "0.1", id, issuer: "x", patient: "p", effective: rec, recorded: rec, narrative: "", payload, ...extra });
const enc = (kind: string, id = "E1", extra: any = {}) => ({ type: "encounter", encounter_id: id, document_kind: kind, class: "inpatient", service: "HM", arrived: "2024-01-01T10:00:00Z", ...extra });
const items = [
  base("A", "2024-01-02T10:00:00Z", { enc: enc("hp"),
    h1: { type: "history", condition: "CKD stage 3a", onset_text: "2016", source: "patient" },
    d1: { type: "diagnosis", label: "CKD stage 3b", icd10cm: "N18.32", status: "active", rank: "secondary" },
    d2: { type: "diagnosis", label: "Cough", icd10cm: "T46.4X5A", status: "active" },
    d3: { type: "diagnosis", label: "Adverse effect of penicillins", icd10cm: "T36.0X5A", status: "active" },
    d4: { type: "diagnosis", label: "Drug-induced liver injury", status: "working" },
    a: { type: "allergy", substance: "NKDA", severity: "unknown" },
    m1: { type: "home_med", drug_name: "amoxicillin 500 mg capsule", rxnorm_ingredient: "723", dose_text: "1 capsule", sig: "1 cap PO every 8 hours", status: "continue" },
    m2: { type: "home_med", drug_name: "quetiapine 50 mg tablet", rxnorm_ingredient: "51272", dose_text: "2 tabs", sig: "2 tabs PO at bedtime", status: "continue" },
    m3: { type: "home_med", drug_name: "lisinopril 10 mg tablet", rxnorm_ingredient: "29046", dose_text: "10 mg", sig: "daily", status: "held" },
    r1: { type: "result", test: { local_code: "GLU", loinc: "2345-7", name: "Glucose" }, accession: "X1", collected: "2024-01-02T09:00:00Z", specimen: "serum", status: "preliminary", value: "6.1", unit: "mmol/L" },
    r2: { type: "result", test: { local_code: "TROPI", name: "Troponin I, high sensitivity" }, accession: "X2", collected: "2024-07-02T09:00:00", specimen: "serum", status: "final", value: "<3", unit: "ng/L" },
  }),
  base("B", "2024-01-03T10:00:00Z", { enc: enc("discharge_summary", "E1", { discharged: "2024-01-03T23:30:00Z" }),
    r1: { type: "result", test: { local_code: "GLU", loinc: "2345-7", name: "Glucose" }, accession: "X1", collected: "2024-01-02T09:00:00Z", specimen: "serum", status: "corrected", value: "6.5", unit: "mmol/L" },
    m3: { type: "home_med", drug_name: "lisinopril 10 mg tablet", rxnorm_ingredient: "29046", dose_text: "10 mg", sig: "daily", status: "stopped", instructions: "Stopped due to cough" },
    m2: { type: "home_med", drug_name: "quetiapine 50 mg tablet", rxnorm_ingredient: "51272", dose_text: "2 tabs", sig: "2 tabs PO at bedtime", status: "continue" },
  }),
  base("C", "2024-01-04T10:00:00Z", { enc: enc("discharge_summary", "E1", { discharged: "2024-01-03T23:30:00Z" }),
    m2: { type: "home_med", drug_name: "quetiapine 50 mg tablet", rxnorm_ingredient: "51272", dose_text: "2 tabs", sig: "2 tabs PO at bedtime", status: "stopped" },
  }, { supersedes: ["B"] }),
  base("D", "2024-01-05T10:00:00Z", { enc: enc("progress_note", "E9") }, { retracts: ["C"] }),
];
console.log(JSON.stringify(transform(items as any, "2024-12-31"), null, 1));
