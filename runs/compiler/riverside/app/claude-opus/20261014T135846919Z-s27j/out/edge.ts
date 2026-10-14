import { transform } from "./transform.ts";
const I = "did:web:x";
const mk = (id: string, recorded: string, payload: any, extra: any = {}) => ({ folio: "0.1", id, issuer: I, patient: "p", effective: recorded, recorded, narrative: "", payload, ...extra });
const enc = (kind: string, extra: any = {}) => ({ type: "encounter", encounter_id: "E1", document_kind: kind, class: "inpatient", service: "HM", admitted: "2024-01-01T10:00:00Z", ...extra });
const items: any[] = [
  mk("A", "2024-01-02T10:00:00Z", { enc: enc("hp"),
    m1: { type: "home_med", drug_name: "lisinopril 20 mg tablet", rxnorm_ingredient: "29046", dose_text: "20 mg", sig: "1 tab PO daily", status: "held" },
    d1: { type: "diagnosis", label: "Angioedema due to lisinopril", icd10cm: "T78.3XXA", status: "active" },
    d2: { type: "diagnosis", label: "Adverse effect of ACE inhibitor", icd10cm: "T46.4X5A", status: "active" },
    d3: { type: "diagnosis", label: "R/O MI", status: "working" },
    h1: { type: "history", condition: "CKD stage 3a", onset_text: "2019", source: "patient" },
    h2: { type: "history", condition: "Major depressive disorder", icd10cm: "F33.1", source: "outside_records" },
    a0: { type: "allergy", substance: "NKDA", severity: "unknown" },
    r1: { type: "result", test: { local_code: "TROPI", loinc: "10839-9", name: "Troponin I" }, accession: "X1", collected: "2024-01-01T09:00:00Z", specimen: "serum", status: "preliminary", value: "<0.01", unit: "ng/mL" },
    p1: { type: "panel", panel: { local_code: "BMP", name: "BMP" }, accession: "X2", collected: "2024-01-01T09:00:00Z", specimen: "serum", status: "final", components: [
      { test: { local_code: "EGFRAA", name: "eGFR if African American" }, value: ">60", unit: "mL/min/1.73m2" },
      { test: { local_code: "EGFRNAA", name: "eGFR if non-African American" }, value: "55", unit: "mL/min/1.73m2" },
      { test: { local_code: "K", loinc: "2823-3", name: "Potassium" }, value: "Hemolyzed, see comment" } ] },
  }),
  mk("B", "2024-01-03T10:00:00Z", { enc: enc("progress_note"),
    r1: { type: "result", test: { local_code: "TROPI", loinc: "10839-9", name: "Troponin I" }, accession: "X1", collected: "2024-01-01T09:00:00Z", specimen: "serum", status: "corrected", value: "0.05", unit: "ng/mL" },
    d3: { type: "diagnosis", label: "R/O MI", status: "ruled_out" },
    h1: { type: "history", condition: "Chronic kidney disease", icd10cm: "N18.32", source: "riverside" },
    a1: { type: "allergy", substance: "penicillins", reaction: "hives", severity: "moderate" },
  }),
  mk("C", "2024-01-05T23:30:00Z", { enc: enc("discharge_summary", { discharged: "2024-01-05T22:00:00Z" }),
    m1: { type: "home_med", drug_name: "lisinopril 20 mg tablet", rxnorm_ingredient: "29046", dose_text: "20 mg", sig: "1 tab PO daily", status: "stopped", instructions: "Stopped due to angioedema" },
    m2: { type: "home_med", drug_name: "amlodipine 5 mg tablet", rxnorm_ingredient: "17767", dose_text: "5 mg", sig: "1 tab PO daily", status: "new" },
    m3: { type: "home_med", drug_name: "sertraline 50 mg tablet", rxnorm_ingredient: "36437", dose_text: "1 tab", sig: "daily", status: "continue" },
  }, { effective: "2024-01-01T10:00:00Z", effective_end: "2024-01-05T22:00:00Z" }),
  mk("C2", "2024-01-06T15:00:00Z", { enc: enc("discharge_summary", { discharged: "2024-01-05T22:00:00Z" }),
    m1: { type: "home_med", drug_name: "lisinopril 20 mg tablet", rxnorm_ingredient: "29046", dose_text: "20 mg", sig: "1 tab PO daily", status: "stopped", instructions: "Stopped due to angioedema" },
    m2: { type: "home_med", drug_name: "amlodipine 5 mg tablet", rxnorm_ingredient: "17767", dose_text: "5 mg", sig: "1 tab PO daily", status: "new" },
  }, { supersedes: ["C"] }),
  mk("R", "2024-01-07T15:00:00Z", {}, { retracts: ["B"] }),
  null, { id: 5 }, mk("Z", "garbage", { x: { type: "vitals" } }),
];
for (const d of ["2024-01-06", "2024-01-07"]) { console.log("=====", d); const r = transform(items, d); for (const [k, v] of Object.entries(r)) { console.log("##", k); for (const x of v as any[]) console.log(JSON.stringify(x)); } }
