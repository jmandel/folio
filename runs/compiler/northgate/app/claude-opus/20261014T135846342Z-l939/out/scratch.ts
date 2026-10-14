import { transform } from "./transform.ts";

let n = 0;
function item(effective: string, recorded: string, payload: Record<string, any>, extra: Record<string, any> = {}): any {
  n++;
  return { folio: "0.1", id: "I" + String(n).padStart(3, "0"), issuer: "did:web:northgate-fm.example", patient: "P", effective, recorded, narrative: "", payload, ...extra };
}
const med = (o: any) => ({ type: "med_event", origin: "northgate", ...o });
const items = [
  item("2022-01-05T10:00:00-06:00", "2022-01-05T10:01:00-06:00", { m: med({ med_id: "ML-1", action: "start", drug: { name: "losartan potassium 50 MG Oral Tablet", rxnorm: "979492" }, dose: { value: 2, unit: "tab" }, frequency: "QD" }) }),
  item("2023-03-01T10:00:00-06:00", "2023-03-01T10:01:00-06:00", { m: med({ med_id: "ML-1", action: "hold", drug: { name: "losartan potassium 50 MG Oral Tablet" }, dose: { value: 2, unit: "tab" }, frequency: "QD", reason_text: "AKI", review_on: "2023-03-15" }) }),
  item("2022-02-01T10:00:00-06:00", "2022-02-01T10:01:00-06:00", { m: med({ med_id: "ML-2", action: "start", drug: { name: "empagliflozin 10 MG Oral Tablet [Jardiance]", rxnorm: "1545664" }, dose: { value: 10, unit: "mg" }, frequency: "QD" }) }),
  item("2023-06-01T10:00:00-05:00", "2023-06-01T10:01:00-05:00", { m: med({ med_id: "ML-2", action: "stop", stop_reason: "adverse_reaction", reason_text: "DKA", drug: { name: "empagliflozin 10 MG Oral Tablet [Jardiance]" }, dose: { value: 10, unit: "mg" } }) }),
  item("2023-06-02", "2023-06-02T10:01:00-05:00", { p: { type: "problem_event", problem_id: "PL-5", action: "add", description: "SGLT2 inhibitor-associated ketoacidosis", icd10cm: "E11.10", onset: { date: "2023-05-01", precision: "month" } } }),
  item("2023-06-02", "2023-06-02T10:01:00-05:00", { p: { type: "problem_event", problem_id: "PL-6", action: "add", description: "Chronic kidney disease stage 3a", icd10cm: "N18.31", onset: { date: "2016-01-01", precision: "year" } } }),
  item("2024-06-02", "2024-06-02T10:01:00-05:00", { p: { type: "problem_event", problem_id: "PL-6", action: "update", description: "Chronic kidney disease stage 3b, A3", icd10cm: "N18.32", onset: { date: "2016-01-01", precision: "year" } } }),
  item("2024-06-02", "2024-06-02T10:01:00-05:00", { p: { type: "problem_event", problem_id: "PL-7", action: "add", description: "Major depressive disorder", icd10cm: "F33.1", restricted: "BH" } }),
  item("2024-06-03", "2024-06-03T10:01:00-05:00", { p: { type: "problem_event", problem_id: "PL-8", action: "add", description: "Adverse effect of ACE inhibitor", icd10cm: "T46.4X5A" } }),
  item("2024-07-01T08:00:00-05:00", "2024-07-01T12:00:00-05:00", {
    plt: { type: "imported_result", test: { nfm_code: "PLT", name: "Platelet count" }, value: "212000", unit: "cells/uL", result_status: "P", collected: "2024-07-01T08:00:00-05:00", resulted: "x", external_ref: { lab: "Lakeview Labs", accession: "A1", result_code: "LK-PLT" } },
    eg: { type: "imported_result", test: { nfm_code: "EGFR-21", name: "eGFR CKD-EPI 2021" }, value: ">60", unit: "mL/min/1.73m2", result_status: "F", collected: "2024-07-01T08:00:00-05:00", resulted: "x", external_ref: { lab: "Lakeview Labs", accession: "A1", result_code: "LK-EGFR21" } },
  }),
  item("2025-01-10T09:00:00-06:00", "2025-01-10T09:01:00-06:00", { v: { type: "vital_set", bp: "152/94", bp_repeat: "144/90", weight_lb: 200 } }),
  item("2025-01-11T23:30:00-06:00", "2025-01-11T23:59:00-06:00", { a: { type: "allergy_event", allergy_id: "AL-1", action: "add", substance: { name: "Penicillin G", rxnorm: "7980" }, reaction_type: "allergy", reactions: ["Hives"], severity: "high" } }),
];
for (const asOf of ["2023-03-01", "2025-01-10", "2026-01-01"]) console.log(asOf, JSON.stringify(transform(items, asOf), null, 1));
