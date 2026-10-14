import { transform } from "./transform.ts";
const base = { folio: "0.1", issuer: "did:web:x", patient: "p", narrative: "" };
const items: any[] = [
  { ...base, id: "A", effective: "2024-01-05T15:00:00Z", recorded: "2024-01-05T16:00:00Z", payload: {
    enc: { type: "encounter", encounter_id: "E1", document_kind: "hp", class: "inpatient", service: "HM", admitted: "2024-01-05T14:00:00Z" },
    h1: { type: "history", condition: "CKD stage 3a", onset_text: "2016", source: "patient" },
    h2: { type: "history", condition: "Major depressive disorder", icd10cm: "F33.1", onset_text: "~10 years", source: "patient" },
    d1: { type: "diagnosis", label: "Lisinopril-associated angioedema", icd10cm: "T46.4X5A", status: "active", rank: "principal" },
    d2: { type: "diagnosis", label: "Adverse effect of NSAID", icd10cm: "T39.395A", status: "active" },
    m1: { type: "home_med", drug_name: "naproxen 220 mg tablet", dose_text: "2 tab", sig: "BID PRN", status: "stopped", instructions: "Stopped due to AKI" },
    m2: { type: "home_med", drug_name: "Jardiance 10 mg tablet", dose_text: "10 mg", sig: "daily", status: "new" },
    a1: { type: "allergy", substance: "NKDA", severity: "unknown" },
    p1: { type: "panel", panel: { local_code: "BMP", name: "x" }, accession: "Q1", collected: "2024-01-05T13:00:00Z", specimen: "serum", status: "preliminary", components: [
      { test: { local_code: "EGFR", name: "eGFR (MDRD, African American)" }, value: ">60", unit: "mL/min/1.73m2" },
      { test: { local_code: "EGFRN", name: "eGFR (MDRD, non-African American)" }, value: "55", unit: "mL/min/1.73m2" },
      { test: { local_code: "GLU", loinc: "2345-7", name: "Glucose" }, value: "Hemolyzed", unit: "mg/dL" } ] },
  } },
  { ...base, id: "B", supersedes: ["A"], effective: "2024-01-05T15:00:00Z", recorded: "2024-01-06T16:00:00Z", payload: { bad: null, x: 3 } },
  { ...base, id: "C", retracts: ["B"], effective: "2024-01-07T15:00:00Z", recorded: "2024-01-07T16:00:00Z", payload: {} },
  null, { id: 5 },
];
for (const d of ["2024-01-05", "2024-01-06", "2024-01-08"]) console.log(d, JSON.stringify(transform(items as any, d), null, 1));
