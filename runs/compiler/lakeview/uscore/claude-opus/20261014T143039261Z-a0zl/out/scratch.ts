import { transform } from "./transform.ts";
const base = { folio: "0.1", issuer: "did:web:x", patient: "P1", narrative: "" };
const items: any[] = [
  { ...base, id: "A", effective: "2022-03-01T09:00:00-06:00", recorded: "2022-03-01T12:00:00-06:00", author: { id: "npi:1", name: "Dr X" }, payload: {
    v: { type: "CLINIC_VISIT", VISIT_ID: "V1", VISIT_AT: "2022-03-01T09:00:00-06:00" },
    m1: { type: "MED_ORDER", RX_ID: "R1", VISIT_ID: "V1", LV_DRUG_ID: "D1", DRUG_NAME: "losartan potassium 50 mg tablet", RXNORM: "979485", DOSE_QTY: 50, DOSE_UNIT: "mg", ROUTE: "PO", FREQ_CODE: "QD", MED_STATUS: 1, START_DATE: "2022-03-01", PRESCRIBER_NPI: "1" },
    m2: { type: "MED_ORDER", RX_ID: "R2", VISIT_ID: "V1", LV_DRUG_ID: "D2", DRUG_NAME: "dapagliflozin 10 mg tablet", DOSE_QTY: 10, DOSE_UNIT: "mg", ROUTE: "PO", FREQ_CODE: "QD", MED_STATUS: 1, START_DATE: "2022-03-01", PRESCRIBER_NPI: "1" } } },
  { ...base, id: "B", effective: "2022-06-01T09:00:00-05:00", recorded: "2022-06-01T12:00:00-05:00", payload: {
    v: { type: "CLINIC_VISIT", VISIT_ID: "V2", VISIT_AT: "2022-06-01T09:00:00-05:00" },
    h1: { type: "MED_STATUS_HIST", HIST_ID: "H1", VISIT_ID: "V2", RX_ID: "R1", OLD_STATUS: 1, NEW_STATUS: 2, CHANGED_AT: "2022-06-01T09:40:00-05:00", REASON_CODE: "OTH", COMMENT_TEXT: "dose increase" },
    m3: { type: "MED_ORDER", RX_ID: "R3", VISIT_ID: "V2", LV_DRUG_ID: "D3", DRUG_NAME: "losartan potassium 100 mg tablet", DOSE_QTY: 100, DOSE_UNIT: "mg", ROUTE: "PO", FREQ_CODE: "QD", MED_STATUS: 1, START_DATE: "2022-06-02", PRESCRIBER_NPI: "1" },
    h2: { type: "MED_STATUS_HIST", HIST_ID: "H2", VISIT_ID: "V2", RX_ID: "R2", OLD_STATUS: 1, NEW_STATUS: 2, CHANGED_AT: "2022-06-01T09:41:00-05:00", REASON_CODE: "ADR" } } },
  { ...base, id: "L1", effective: "2022-05-01T08:00:00-05:00", recorded: "2022-05-01T10:00:00-05:00", payload: {
    req: { type: "LAB_REQ", COLLECTED_AT: "2022-05-01T08:00:00-05:00" },
    o1: { type: "LAB_ORDER", ORDER_ID: "O1", ORDER_STATUS: 4 }, o2: { type: "LAB_ORDER", ORDER_ID: "O2", ORDER_STATUS: 9 },
    r1: { type: "LAB_RESULT", RESULT_ID: "X1", ORDER_ID: "O1", TEST_CODE: "LK-EGFR21", VALUE_TEXT: ">90", VALUE_NUM: 9999999, UNIT_CODE: "mL/min/1.73m2", RESULT_STATUS: "P", COMMENT_TEXT: "Calculated by CKD-EPI 2021 (race-free)." },
    r2: { type: "LAB_RESULT", RESULT_ID: "X2", ORDER_ID: "O2", TEST_CODE: "LK-K", VALUE_TEXT: "4.1", VALUE_NUM: 4.1, UNIT_CODE: "mmol/L", RESULT_STATUS: "F" },
    r3: { type: "LAB_RESULT", RESULT_ID: "X3", ORDER_ID: "O1", TEST_CODE: "LK-PLT", VALUE_TEXT: "212", VALUE_NUM: 212, UNIT_CODE: "K/uL", RESULT_STATUS: "A" } } },
];
const r = transform(items, "2022-12-31");
console.log(JSON.stringify(r.medicationRequests.map(m => [m.id, m.status, m.medicationCodeableConcept, m.statusReason, m.authoredOn])));
console.log(JSON.stringify(r.observations.map(o => [o.id, o.status, o.valueQuantity, o.method, o.code.coding])));
console.log(JSON.stringify(transform(items, "2022-05-31").medicationRequests.map(m => [m.id, m.status])));
