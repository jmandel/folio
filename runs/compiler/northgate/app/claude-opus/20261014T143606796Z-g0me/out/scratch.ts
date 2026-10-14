import { transform } from "./transform.ts";
const base = { folio: "0.1", issuer: "did:web:northgate-fm.example", patient: "P", narrative: "" };
let n = 0;
function it(effective: string, recorded: string, payload: Record<string, any>, extra: any = {}) {
  return { ...base, id: "I" + ++n, effective, recorded, payload, ...extra };
}
const items = [
  it("2021-01-05T09:00:00-06:00", "2021-01-05T09:01:00-06:00", {
    m: { type: "med_event", med_id: "A", action: "start", origin: "northgate", drug: { name: "losartan potassium 50 MG Oral Tablet", rxnorm: "979492" }, dose: { value: 2, unit: "tablet" }, frequency: "QD" },
    e: { type: "med_event", med_id: "B", action: "start", origin: "outside", drug: { name: "Jardiance 10 MG Oral Tablet [Jardiance]" }, dose: { value: 10, unit: "mg" }, frequency: "QD" },
    s: { type: "med_event", med_id: "C", action: "start", origin: "northgate", drug: { name: "sertraline 50 MG Oral Tablet" }, restricted: "BH", dose: { value: 1, unit: "tablet" }, frequency: "QD" },
  }),
  it("2021-03-01T09:00:00-06:00", "2021-03-01T09:01:00-06:00", {
    m: { type: "med_event", med_id: "B", action: "stop", origin: "outside", drug: { name: "Jardiance 10 MG Oral Tablet [Jardiance]" }, stop_reason: "adverse_reaction", reason_text: "DKA" },
    p: { type: "problem_event", problem_id: "P1", action: "add", description: "SGLT2 inhibitor-associated ketoacidosis", icd10cm: "E11.10" },
    p2: { type: "problem_event", problem_id: "P2", action: "add", description: "Chronic kidney disease, stage 3a, A2", icd10cm: "N18.31" },
    p3: { type: "problem_event", problem_id: "P3", action: "add", description: "Adverse effect of angiotensin-converting-enzyme inhibitors, initial encounter", icd10cm: "T46.4X5A" },
    p4: { type: "problem_event", problem_id: "P4", action: "add", description: "HIV-associated nephropathy", icd10cm: "B20" },
  }),
  it("2021-04-01", "2021-04-01T10:00:00-05:00", {
    m: { type: "med_event", med_id: "A", action: "hold", origin: "northgate", drug: { name: "losartan potassium 50 MG Oral Tablet" }, reason_text: "AKI" },
    p2: { type: "problem_event", problem_id: "P2", action: "update", description: "Chronic kidney disease stage 3b", icd10cm: "N18.32" },
  }),
  it("2021-05-01T09:00:00-05:00", "2021-05-02T04:30:00Z", {
    v: { type: "vital_set", bp: "150/90", bp_repeat: "140/85", weight_lb: 200 },
  }),
];
const bad = it("2021-05-03T09:00:00-05:00", "2021-05-03T09:00:00-05:00", { m: { type: "med_event", med_id: "Z", action: "start", origin: "northgate", drug: { name: "furosemide 40 MG Oral Tablet" } } });
items.push(bad, it("2021-05-04T09:00:00-05:00", "2021-05-04T09:00:00-05:00", { c: { type: "chart_correction", voided_items: [bad.id], reason: "wrong_patient" } }));
for (const asOf of ["2021-02-01", "2021-05-01", "2021-05-03", "2026-01-01"]) console.log(asOf, JSON.stringify(transform(items as any, asOf), null, 1));
console.log(JSON.stringify(transform(null as any, "x")));
