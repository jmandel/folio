import { transform } from "./transform.ts";
const base = { folio: "0.1", issuer: "x", patient: "p", narrative: "" };
const items: any[] = [
  { ...base, id: "A", effective: "2024-01-01T10:00:00Z", recorded: "2024-01-01T12:00:00Z", payload: {
    enc: { type: "encounter", document_kind: "discharge_summary", class: "inpatient", service: "x", discharged: "2024-01-03T15:00:00Z" },
    m1: { type: "home_med", drug_name: "famotidine 10 mg tablet", dose_text: "10 mg", sig: "take 2 tabs PO BID", status: "new" },
    m2: { type: "home_med", drug_name: "Ventolin HFA 90 mcg/actuation inhaler", dose_text: "2 puffs", sig: "2 puffs q6h PRN wheeze", status: "continue" },
    m3: { type: "home_med", drug_name: "amoxicillin trihydrate 500 mg capsule", dose_text: "500 mg", sig: "1 cap TID", status: "stopped", instructions: "Hives on amoxicillin" },
    m4: { type: "home_med", drug_name: "quetiapine 100 mg tablet", dose_text: "100 mg", sig: "1 tab nightly", status: "continue" },
    d1: { type: "diagnosis", label: "Adverse effect of penicillins", icd10cm: "T36.0X5A", status: "active" },
    d2: { type: "diagnosis", label: "Chronic kidney disease stage 3b, A2", icd10cm: "N18.32", status: "active" },
    h1: { type: "history", condition: "Bipolar I disorder", icd10cm: "F31.9", onset_text: "June 2019", source: "patient" },
    r1: { type: "result", test: { local_code: "CREAT", name: "Creatinine" }, accession: "X1", collected: "2024-01-01T07:00:00", specimen: "serum", status: "preliminary", value: "150", unit: "umol/L" },
  } },
  { ...base, id: "B", effective: "2024-01-01T10:00:00Z", recorded: "2024-01-02T12:00:00Z", supersedes: ["A"], payload: {
    r1: { type: "result", test: { local_code: "CREAT", name: "Creatinine" }, accession: "X1", collected: "2024-01-01T07:00:00", specimen: "serum", status: "final", value: "1.8", unit: "mg/dL" },
    d1: { type: "diagnosis", label: "Adverse effect of penicillins", icd10cm: "T36.0X5A", status: "active" },
    m3: { type: "home_med", drug_name: "amoxicillin trihydrate 500 mg capsule", dose_text: "500 mg", sig: "1 cap TID", status: "stopped", instructions: "Hives on amoxicillin" },
  } },
  { ...base, id: "C", effective: "2024-02-01", recorded: "2024-02-01T12:00:00Z", retracts: ["B"], payload: {} },
];
for (const d of ["2024-01-01", "2024-01-02", "2024-02-01"]) console.log(d, JSON.stringify(transform(items, d), null, 1));
