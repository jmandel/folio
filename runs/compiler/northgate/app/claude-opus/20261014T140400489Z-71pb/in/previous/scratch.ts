import { transform } from "./transform.ts";
const base = { folio: "0.1", issuer: "did:web:n", patient: "p", narrative: "" };
let n = 0;
const it = (eff: string, rec: string, payload: any, extra: any = {}) => ({ ...base, id: "I" + (++n), effective: eff, recorded: rec, payload, ...extra });
const items = [
  it("2022-01-01T10:00:00-06:00", "2022-01-01T10:00:00-06:00", { m: { type: "med_event", med_id: "ML-1", action: "start", origin: "northgate", drug: { name: "losartan potassium 50 MG Oral Tablet", rxnorm: "979492" }, dose: { value: 2, unit: "tab" }, frequency: "QD" } }),
  it("2023-03-01T10:00:00-06:00", "2023-03-01T10:00:00-06:00", { m: { type: "med_event", med_id: "ML-1", action: "hold", origin: "northgate", drug: { name: "losartan potassium 50 MG Oral Tablet" }, dose: { value: 2, unit: "tab" }, frequency: "QD", reason_text: "AKI", review_on: "2023-04-01" } }),
  it("2023-01-01", "2023-01-02T10:00:00-06:00", { m: { type: "med_event", med_id: "ML-2", action: "start", origin: "outside", drug: { name: "Jardiance 10 mg tablet", outside_code: { system: "lakeview-drug", code: "X" } }, dose: { value: 10, unit: "mg" }, frequency: "QD" } }),
  it("2023-05-01", "2023-05-01T10:00:00-05:00", { m: { type: "med_event", med_id: "ML-2", action: "stop", origin: "outside", drug: { name: "Jardiance 10 mg tablet" }, stop_reason: "adverse_reaction", reason_text: "DKA" },
    p: { type: "problem_event", problem_id: "PL-1", action: "add", description: "SGLT2 inhibitor-associated ketoacidosis", icd10cm: "E11.10", onset: { date: "2023-04-01", precision: "month" } } }),
  it("2023-05-02", "2023-05-02T10:00:00-05:00", { p: { type: "problem_event", problem_id: "PL-2", action: "add", description: "Chronic kidney disease stage 3a", icd10cm: "N18.31", onset: { date: "2016-01-01", precision: "year" }, restricted: undefined } }),
  it("2024-05-02", "2024-05-02T10:00:00-05:00", { p: { type: "problem_event", problem_id: "PL-2", action: "update", description: "Chronic kidney disease stage 3b, A2", icd10cm: "N18.32" } }),
  it("2024-05-02", "2024-05-02T10:00:00-05:00", { p: { type: "problem_event", problem_id: "PL-3", action: "add", description: "Major depressive disorder", icd10cm: "F33.1", restricted: "BH" },
     m: { type: "med_event", med_id: "ML-3", action: "start", origin: "northgate", drug: { name: "sertraline 50 MG Oral Tablet" }, dose: { value: 1, unit: "tab" }, frequency: "QD", restricted: "BH" } }),
  it("2024-06-01T08:00:00-05:00", "2024-06-01T12:00:00-05:00", {
    plt: { type: "imported_result", test: { nfm_code: "PLT", name: "Platelets" }, value: "212000", unit: "cells/uL", result_status: "F", collected: "2024-06-01T08:00:00-05:00", resulted: "x", external_ref: { lab: "Lakeview Labs", accession: "A1", result_code: "LK-PLT" } },
    e21: { type: "imported_result", test: { nfm_code: "EGFR-CKD21", name: "eGFR" }, value: ">60", unit: "mL/min/1.73m2", result_status: "P", collected: "2024-06-01T08:00:00-05:00", resulted: "x", comment: "CKD-EPI 2021 equation (race-free)", external_ref: { lab: "Lakeview Labs", accession: "A1", result_code: "LK-EGFR21" } },
    ucr: { type: "imported_result", test: { nfm_code: "UCREAT", name: "Creatinine, urine" }, value: "80", unit: "mg/dL", result_status: "F", collected: "2024-06-01T08:00:00-05:00", resulted: "x", external_ref: { lab: "Lakeview Labs", accession: "A1", result_code: "LK-UCR" } },
  }),
  it("2024-07-01T08:00:00-05:00", "2024-07-01T08:00:00-05:00", { v: { type: "vital_set", bp: "152/94", bp_repeat: "144/90", weight_lb: 200 } }),
  it("2024-07-01T09:00:00-05:00", "2024-07-01T09:00:00-05:00", { m: { type: "med_event", med_id: "ML-9", action: "start", origin: "northgate", drug: { name: "furosemide 40 MG Oral Tablet" } } }),
  it("2024-07-02T09:00:00-05:00", "2024-07-02T09:00:00-05:00", { c: { type: "chart_correction", voided_items: ["I10"], reason: "wrong_patient" } }, { retracts: ["I10"] }),
  it("2024-08-01", "2024-08-01T10:00:00-05:00", { p: { type: "problem_event", problem_id: "PL-4", action: "add", description: "Adverse effect of angiotensin-converting-enzyme inhibitors, initial encounter", icd10cm: "T46.4X5A" } }),
];
console.log(JSON.stringify(transform(items as any, "2026-01-01"), null, 1));
console.log(JSON.stringify(transform(items as any, "2024-07-01").medications.map(m => m.drug_name)));
