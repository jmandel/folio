import { transform } from "./transform.ts";
let n = 0;
const it = (eff: string, payload: any, extra: any = {}) => ({ folio: "0.1", id: "I" + String(++n).padStart(3, "0"), issuer: "did:web:n", patient: "p", effective: eff, recorded: extra.recorded ?? eff, narrative: "", payload, ...extra });
const med = (o: any) => ({ type: "med_event", origin: "northgate", ...o });
const items = [
  it("2022-01-10T10:00:00-06:00", { m: med({ med_id: "ML-1", action: "start", drug: { name: "metformin hydrochloride 500 MG Oral Tablet", rxnorm: "861007" }, dose: { value: 2, unit: "tab" }, frequency: "BID" }) }),
  it("2023-03-01T10:00:00-06:00", { m: med({ med_id: "ML-1", action: "hold", drug: { name: "metformin hydrochloride 500 MG Oral Tablet" }, dose: { value: 2, unit: "tab" }, frequency: "BID", reason_text: "contrast CT", review_on: "2023-03-05" }) }),
  it("2023-04-01T10:00:00-05:00", { m: med({ med_id: "ML-1", action: "change", drug: { name: "metformin hydrochloride 500 MG Oral Tablet" }, dose: { value: 1, unit: "tab" }, frequency: "BID" }) }),
  it("2022-01-10T10:00:00-06:00", { m: med({ med_id: "ML-2", action: "start", drug: { name: "lisinopril 20 MG Oral Tablet" }, dose: { value: 20, unit: "mg" }, frequency: "QD" }) }),
  it("2022-06-10T10:00:00-05:00", { m: med({ med_id: "ML-2", action: "stop", stop_reason: "adverse_reaction", reason_text: "cough", drug: { name: "lisinopril 20 MG Oral Tablet" }, dose: { value: 20, unit: "mg" }, frequency: "QD" }) }),
  it("2022-06-10", { m: med({ med_id: "ML-3", action: "start", origin: "outside", drug: { name: "Jardiance 10 MG Oral Tablet", outside_code: { system: "lakeview-drug", code: "X" } }, dose: { value: 1, unit: "tab" }, frequency: "OTHER", sig: "1 tab once weekly" }) }),
  it("2022-06-10T11:00:00-05:00", { m: med({ med_id: "ML-4", action: "start", restricted: "BH", drug: { name: "sertraline 50 MG Oral Tablet [Zoloft]" }, dose: { value: 50, unit: "mg" }, frequency: "QD" }) }),
  it("2024-06-10T11:00:00-05:00", { m: med({ med_id: "ML-5", action: "start", drug: { name: "lisinopril 10 MG Oral Tablet" }, dose: { value: 10, unit: "mg" }, frequency: "QD" }) }),
  it("2024-06-10T11:00:00-05:00", { p: { type: "problem_event", problem_id: "PL-1", action: "add", description: "Chronic kidney disease stage 3a", icd10cm: "N18.31", onset: { date: "2016-01-01", precision: "year" } } }),
  it("2025-06-10T11:00:00-05:00", { p: { type: "problem_event", problem_id: "PL-1", action: "update", description: "Chronic kidney disease stage 3b, A3", icd10cm: "N18.32" } }),
  it("2025-06-10T11:00:00-05:00", { p: { type: "problem_event", problem_id: "PL-2", action: "add", description: "SGLT2 inhibitor-associated ketoacidosis", icd10cm: "E11.10" }, m: med({ med_id: "ML-3", action: "stop", stop_reason: "adverse_reaction", drug: { name: "Jardiance 10 MG Oral Tablet" } }) }),
  it("2025-06-11T11:00:00-05:00", { p: { type: "problem_event", problem_id: "PL-3", action: "add", description: "Adverse effect of angiotensin-converting-enzyme inhibitors", icd10cm: "T46.4X5A" } }),
  it("2025-06-11T11:00:00-05:00", { p: { type: "problem_event", problem_id: "PL-4", action: "add", description: "Major depressive disorder", icd10cm: "F33.1", restricted: "BH" } }),
  it("2025-06-12T11:00:00-05:00", { p: { type: "problem_event", problem_id: "PL-4", action: "resolve", description: "Major depressive disorder", icd10cm: "F33.1", restricted: "BH" } }),
  it("2025-06-12T11:00:00-05:00", { p: { type: "problem_event", problem_id: "PL-5", action: "remove", description: "Gout", icd10cm: "M10.9" } }),
  it("2025-06-12T07:00:00-05:00", { a: { type: "imported_result", test: { nfm_code: "PLT", name: "Platelets" }, value: "212000", unit: "cells/uL", result_status: "P", collected: "2025-06-12T07:00:00-05:00", resulted: "x", external_ref: { lab: "Lakeview Labs", accession: "A1", result_code: "LK-PLT" } },
     e: { type: "imported_result", test: { nfm_code: "EGFR-CKD21", name: "eGFR" }, value: ">60", unit: "mL/min/1.73m2", result_status: "F", collected: "2025-06-12T07:00:00-05:00", resulted: "x", comment: "CKD-EPI 2021 race-free", external_ref: { lab: "Lakeview Labs", accession: "A1", result_code: "LK-EGFR21" } } }, { id: "LABP" }),
  it("2025-06-12T07:00:00-05:00", { a: { type: "imported_result", test: { nfm_code: "PLT", name: "Platelets" }, value: "7400", unit: "cells/uL", result_status: "F", collected: "2025-06-12T07:00:00-05:00", resulted: "x", external_ref: { lab: "Lakeview Labs", accession: "A1", result_code: "LK-PLT" } } }, { supersedes: ["LABP"], recorded: "2025-06-13T07:00:00-05:00" }),
  it("2025-06-12T09:00:00-05:00", { v: { type: "vital_set", bp: "152/94", bp_repeat: "144/90", weight_lb: 200.0 } }),
  it("2025-07-01T09:00:00-05:00", { a: { type: "allergy_event", allergy_id: "AL-1", action: "add", substance: { name: "Penicillin G", rxnorm: "7980" }, reaction_type: "allergy", reactions: ["Hives"], severity: "high" } }),
  it("2025-07-01T09:00:00-05:00", { a: { type: "allergy_event", allergy_id: "AL-2", action: "add", substance: { name: "Peanuts" }, reaction_type: "allergy", reactions: ["Anaphylaxis"], severity: "high" } }),
  it("2025-07-05T09:00:00-05:00", { a: { type: "allergy_event", allergy_id: "AL-2", action: "inactivate", substance: { name: "Peanuts" }, reaction_type: "allergy", reactions: ["Anaphylaxis"], severity: "high" } }),
  it("2025-07-05T09:00:00-05:00", { m: med({ med_id: "ML-9", action: "start", drug: { name: "furosemide 40 MG Oral Tablet" } }) }, { id: "BAD" }),
  it("2025-07-06T09:00:00-05:00", { c: { type: "chart_correction", voided_items: ["BAD"], reason: "wrong_patient" } }, { retracts: ["BAD"] }),
];
console.log(JSON.stringify(transform(items as any, "2026-01-01"), null, 1));
