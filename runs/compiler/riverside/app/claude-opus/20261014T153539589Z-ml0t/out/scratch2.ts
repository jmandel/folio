import { transform } from "./transform.ts";
const base = { folio: "0.1", issuer: "x", patient: "p", narrative: "" };
const enc = (kind: string, extra: any = {}) => ({ type: "encounter", encounter_id: "E1", document_kind: kind, class: "inpatient", service: "HM", ...extra });
const items: any[] = [
  { ...base, id: "A", effective: "2024-01-10T15:00:00Z", recorded: "2024-01-10T16:00:00Z", payload: {
    enc: enc("hp"),
    h1: { type: "history", condition: "CKD stage 3a", onset_text: "2016", source: "patient" },
    h2: { type: "history", condition: "Type 2 diabetes", onset_text: "~10 years", source: "patient" },
    h3: { type: "history", condition: "Bipolar disorder", source: "outside_records" },
    d1: { type: "diagnosis", label: "Adverse effect of naproxen", icd10cm: "T39.395A", status: "active", rank: "secondary" },
    d2: { type: "diagnosis", label: "Hives due to amoxicillin", status: "active", rank: "secondary" },
    m1: { type: "home_med", drug_name: "Ventolin HFA 90 mcg/actuation inhaler", dose_text: "2 puffs", sig: "every 6 hours as needed for wheeze", status: "continue" },
    m2: { type: "home_med", drug_name: "quetiapine fumarate 100 mg tablet", rxnorm_ingredient: "51272", dose_text: "100 mg", sig: "1 tab PO nightly", status: "new" },
    m3: { type: "home_med", drug_name: "insulin glargine 100 units/mL pen", rxnorm_ingredient: "274783", dose_text: "18 units", sig: "SubQ daily", status: "changed" },
    a0: { type: "allergy", substance: "NKDA", severity: "unknown" },
  }},
  { ...base, id: "B", effective: "2024-01-10T15:00:00Z", effective_end: "2024-01-12T18:00:00Z", recorded: "2024-01-12T20:00:00Z", payload: {
    enc: enc("discharge_summary", { discharged: "2024-01-12T18:00:00Z", disposition: "home" }),
    d3: { type: "diagnosis", label: "CKD stage 3b", icd10cm: "N18.32", status: "active", rank: "secondary" },
    m2: { type: "home_med", drug_name: "quetiapine fumarate 100 mg tablet", rxnorm_ingredient: "51272", dose_text: "100 mg", sig: "1 tab PO nightly", status: "stopped", instructions: "Stopped due to sedation" },
    a1: { type: "allergy", substance: "penicillins", reaction: "hives, lip swelling", severity: "severe" },
  }},
  { ...base, id: "C", effective: "2024-01-12", recorded: "2024-01-13T20:00:00Z", retracts: ["B"], payload: {} },
];
console.log(JSON.stringify(transform(items, "2024-01-12"), null, 1));
console.log(JSON.stringify(transform(items, "2024-01-14").medications));
console.log(JSON.stringify(transform([{...items[0], payload: null}, null as any, {id: 5}], "2024-01-14")));
