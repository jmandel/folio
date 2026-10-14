import { transform } from "./transform.ts";
let n = 0;
const it = (eff: string, rec: string, payload: any, extra: any = {}) => ({ folio: "0.1", id: `I${++n}`, issuer: "x", patient: "p", effective: eff, recorded: rec, narrative: "", payload, ...extra });
const items = [
  it("2022-01-05T10:00:00-06:00", "2022-01-05T10:01:00-06:00", { m: { type: "med_event", med_id: "ML-1", action: "start", origin: "northgate", drug: { name: "losartan potassium 50 MG Oral Tablet", rxnorm: "979492" }, dose: { value: 2, unit: "tab" }, frequency: "QD" } }),
  it("2023-03-05T10:00:00-06:00", "2023-03-05T10:01:00-06:00", { m: { type: "med_event", med_id: "ML-1", action: "change", origin: "northgate", drug: { name: "losartan potassium 100 MG Oral Tablet" }, dose: { value: 1, unit: "tab" }, frequency: "QD", reason_text: "BP up" } }),
  it("2024-03-05T10:00:00-06:00", "2024-03-05T10:01:00-06:00", { m: { type: "med_event", med_id: "ML-1", action: "hold", origin: "northgate", drug: { name: "losartan potassium 100 MG Oral Tablet" }, dose: { value: 1, unit: "tab" }, frequency: "QD", reason_text: "AKI", review_on: "2024-04-01" } }),
  it("2023-01-01T10:00:00-06:00", "2023-01-01T10:01:00-06:00", { m: { type: "med_event", med_id: "ML-2", action: "start", origin: "outside", drug: { name: "Jardiance 10 mg tablet", outside_code: { system: "lakeview-drug", code: "1" } }, dose: { value: 10, unit: "mg" }, frequency: "QD" } }),
  it("2023-06-01T10:00:00-05:00", "2023-06-01T10:01:00-05:00", { m: { type: "med_event", med_id: "ML-2", action: "stop", origin: "outside", drug: { name: "Jardiance 10 mg tablet" }, dose: { value: 10, unit: "mg" }, frequency: "QD", stop_reason: "adverse_reaction", reason_text: "DKA" } }),
  it("2023-01-01T10:00:00-06:00", "2023-01-01T10:01:00-06:00", { m: { type: "med_event", med_id: "ML-3", action: "start", origin: "northgate", drug: { name: "hydrochlorothiazide 12.5 MG / lisinopril 20 MG Oral Tablet" }, dose: { value: 1, unit: "tab" }, frequency: "QD", restricted: "BH" } }),
  it("2023-01-01T10:00:00-06:00", "2023-01-01T10:01:00-06:00", { m: { type: "med_event", med_id: "ML-4", action: "start", origin: "northgate", drug: { name: "sertraline 50 MG Oral Tablet [Zoloft]" }, dose: { value: 1, unit: "tab" }, frequency: "QD" } }),
  it("2022-01-01", "2022-01-01T10:01:00-06:00", { p: { type: "problem_event", problem_id: "PL-1", action: "add", description: "Chronic kidney disease stage 3a", icd10cm: "N18.31", onset: { date: "2016-01-01", precision: "year" } } }),
  it("2024-01-01", "2024-01-01T10:01:00-06:00", { p: { type: "problem_event", problem_id: "PL-1", action: "update", description: "Chronic kidney disease stage 3b, A2", icd10cm: "N18.32" } }),
  it("2023-06-02", "2023-06-02T10:01:00-05:00", { p: { type: "problem_event", problem_id: "PL-2", action: "add", description: "Diabetic ketoacidosis due to empagliflozin", icd10cm: "E11.10" } }),
  it("2023-06-02", "2023-06-02T10:01:00-05:00", { p: { type: "problem_event", problem_id: "PL-3", action: "add", description: "Adverse effect of penicillins", icd10cm: "T36.0X5A" } }),
  it("2023-06-02", "2023-06-02T10:01:00-05:00", { p: { type: "problem_event", problem_id: "PL-4", action: "add", description: "Major depressive disorder", icd10cm: "F33.1", restricted: "BH" } }),
  it("2023-06-02", "2023-06-02T10:01:00-05:00", { p: { type: "problem_event", problem_id: "PL-5", action: "add", description: "Gout", icd10cm: "M10.9" } }),
  it("2023-07-02", "2023-07-02T10:01:00-05:00", { p: { type: "problem_event", problem_id: "PL-5", action: "remove", description: "Gout", icd10cm: "M10.9" } }),
  it("2025-03-04T03:30:00Z", "2025-03-04T03:30:00Z", { a: { type: "imported_result", test: { nfm_code: "PLT", name: "Platelets" }, value: "212000", unit: "cells/uL", result_status: "P", collected: "2025-03-04T03:30:00Z", resulted: "x", external_ref: { lab: "Lakeview Labs", accession: "A1", result_code: "LK-PLT" } },
    b: { type: "imported_result", test: { nfm_code: "EGFR-21", name: "eGFR CKD-EPI 2021" }, value: ">90", unit: "mL/min/1.73m2", result_status: "F", collected: "2025-03-04T03:30:00Z", resulted: "x", external_ref: { lab: "Lakeview Labs", accession: "A1", result_code: "LK-EGFR21" } } }),
  it("2025-03-04T03:30:00Z", "2025-03-04T15:30:00Z", { a: { type: "imported_result", test: { nfm_code: "PLT", name: "Platelets" }, value: "215000", unit: "cells/uL", result_status: "F", collected: "2025-03-04T03:30:00Z", resulted: "x", external_ref: { lab: "Lakeview Labs", accession: "A1", result_code: "LK-PLT" } },
    b: { type: "imported_result", test: { nfm_code: "EGFR-21", name: "eGFR CKD-EPI 2021" }, value: ">90", unit: "mL/min/1.73m2", result_status: "F", collected: "2025-03-04T03:30:00Z", resulted: "x", external_ref: { lab: "Lakeview Labs", accession: "A1", result_code: "LK-EGFR21" } } }, { supersedes: ["I15"] }),
  it("2025-07-04T09:00:00", "2025-07-04T09:05:00", { v: { type: "vital_set", bp: "152/94", bp_repeat: "144/90", weight_lb: 154 } }),
  it("2025-07-05T09:00:00-05:00", "2025-07-05T09:05:00-05:00", { v: { type: "vital_set", bp: "120/80" } }),
  it("2025-07-06T09:00:00-05:00", "2025-07-06T09:05:00-05:00", { v: { type: "chart_correction", voided_items: ["I18"], reason: "duplicate" } }, { retracts: ["I18"] }),
  null as any, { junk: 1 } as any,
];
for (const a of ["2024-06-01", "2025-03-03", "2026-01-01"]) console.log(a, JSON.stringify(transform(items, a), null, 1));
