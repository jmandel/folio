import { transform } from "./transform.ts";
const base = { folio: "0.1", issuer: "x", patient: "p", narrative: "" };
const it = (id: string, eff: string, rec: string, payload: any, extra: any = {}) => ({ ...base, id, effective: eff, recorded: rec, payload, ...extra });
const items = [
  it("A", "2022-01-01T09:00:00-06:00", "2022-01-01T09:00:00-06:00", { m: { type: "med_event", med_id: "M1", action: "start", origin: "northgate", drug: { name: "losartan potassium 50 MG Oral Tablet" }, dose: { value: 2, unit: "tablet" }, frequency: "QD" } }),
  it("B", "2022-03-01T09:00:00-06:00", "2022-03-01T09:00:00-06:00", { m: { type: "med_event", med_id: "M1", action: "hold", origin: "northgate", drug: { name: "losartan potassium 50 MG Oral Tablet" }, reason_text: "AKI", review_on: "2022-04-01" } }),
  it("C", "2022-02-01T09:00:00-06:00", "2022-02-01T09:00:00-06:00", { m: { type: "med_event", med_id: "M2", action: "start", origin: "outside", drug: { name: "empagliflozin 10 MG Oral Tablet [Jardiance]" }, dose: { value: 10, unit: "mg" }, frequency: "QD", restricted: "BH" },
    p: { type: "problem_event", problem_id: "P1", action: "add", description: "SGLT2 inhibitor-associated ketoacidosis", icd10cm: "E11.10" },
    p2: { type: "problem_event", problem_id: "P2", action: "add", description: "Chronic kidney disease stage 3a", icd10cm: "N18.31", onset: { date: "2016", precision: "year" } } }),
  it("D", "2022-02-02T23:30:00-06:00", "2022-02-03T05:59:00Z", { m: { type: "med_event", med_id: "M2", action: "stop", origin: "outside", drug: { name: "empagliflozin 10 MG Oral Tablet [Jardiance]" }, stop_reason: "adverse_reaction", reason_text: "DKA" },
    t: { type: "problem_event", problem_id: "P3", action: "add", description: "Adverse effect of ACE inhibitor", icd10cm: "T46.4X5A" },
    l: { type: "imported_result", test: { nfm_code: "PLT", name: "Platelets" }, value: "212000", unit: "/uL", result_status: "P", collected: "2022-02-02T08:00:00", resulted: "x", external_ref: { lab: "Lakeview Labs", accession: "A1", result_code: "PLT" } },
    v: { type: "vital_set", bp: "120/80", bp_repeat: "118/76" } }),
  it("E", "2022-02-03", "2022-02-04T10:00:00-06:00", {}, { retracts: ["C"] }),
];
console.log(JSON.stringify(transform(items as any, "2022-02-02"), null, 1));
console.log(JSON.stringify(transform(items as any, "2022-03-05").medications.map(m => [m.ingredient, m.status, m.status_since, m.dose])));
console.log(JSON.stringify(transform(items as any, "2022-03-05").problems));
