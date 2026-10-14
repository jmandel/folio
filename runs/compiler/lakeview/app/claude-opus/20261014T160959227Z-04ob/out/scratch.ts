import { transform } from "./transform.ts";
const g = JSON.parse(await Bun.file("in/samples/samples.json").text());
const items = g[0].items;
for (const a of ["2021-07-10","2021-07-11","2021-10-07","2021-09-07"]) {
  const r = transform(items, a);
  console.log(a, JSON.stringify(r.medications.map(m=>[m.status,m.status_since])), r.labs.length, r.problems.map(p=>p.ckd_stage+p.condition.slice(0,20)));
}
const synth = {
  id: "X1", folio:"0.1", issuer:"x", patient:"p", effective:"2024-01-02T15:00:00Z", recorded:"2024-01-03T03:00:00Z", narrative:"<ref id=\"d1\">Cough due to lisinopril since March 2023</ref>",
  payload: {
    d1: {type:"VISIT_DX", VISIT_ID:"V1", DX_RANK:1, ICD10CM:"R05.9", DX_TEXT:"Cough due to lisinopril", DX_STATUS:"A"},
    d2: {type:"VISIT_DX", VISIT_ID:"V1", DX_RANK:2, ICD10CM:"T46.4X5A", DX_TEXT:"Adverse effect of angiotensin-converting-enzyme inhibitors, initial encounter", DX_STATUS:"A"},
    rx: {type:"MED_ORDER", RX_ID:"R1", VISIT_ID:"V1", LV_DRUG_ID:"L", DRUG_NAME:"lisinopril 20 mg tablet", DOSE_QTY:20, DOSE_UNIT:"mg", ROUTE:"PO", FREQ_CODE:"QD", MED_STATUS:2, START_DATE:"2022-01-01", PRESCRIBER_NPI:"1"},
    h: {type:"MED_STATUS_HIST", HIST_ID:"H1", VISIT_ID:"V1", RX_ID:"R1", OLD_STATUS:1, NEW_STATUS:2, CHANGED_AT:"2024-01-02T09:10:00", REASON_CODE:"ADR", COMMENT_TEXT:"cough"},
    v: {type:"VITAL", VISIT_ID:"V1", VITAL_CODE:"BPS", VALUE_NUM:150, UNIT_CODE:"mmHg", READING_NO:2, TAKEN_AT:"2024-01-02T09:20:00"},
    v1: {type:"VITAL", VISIT_ID:"V1", VITAL_CODE:"BPS", VALUE_NUM:160, UNIT_CODE:"mmHg", READING_NO:1, TAKEN_AT:"2024-01-02T09:05:00"},
  }};
console.log(JSON.stringify(transform([synth as any], "2024-01-02"), null, 1));
console.log(JSON.stringify(transform([synth as any, {bad:1} as any, null as any], "2024-01-01")));
