import { transform } from "./transform.ts";
const base = { folio: "0.1", issuer: "did:web:x", patient: "p", narrative: "" };
const items: any[] = [
  { ...base, id: "L1", effective: "2022-03-01T08:00:00-06:00", recorded: "2022-03-01T12:00:00-06:00", payload: {
    req: { type: "LAB_REQ", REQ_ID: "R1", COLLECTED_AT: "2022-03-01T08:00:00-06:00" },
    o1: { type: "LAB_ORDER", ORDER_ID: "O1", REQ_ID: "R1", ORDER_STATUS: 4 },
    o2: { type: "LAB_ORDER", ORDER_ID: "O2", REQ_ID: "R1", ORDER_STATUS: 9 },
    o3: { type: "LAB_ORDER", ORDER_ID: "O3", REQ_ID: "R1", ORDER_STATUS: 3 },
    c: { type: "LAB_RESULT", RESULT_ID: "C1", ORDER_ID: "O1", TEST_CODE: "LK-CREAT", VALUE_TEXT: "1.4", VALUE_NUM: 1.4, UNIT_CODE: "mg/dL", RESULT_STATUS: "F" },
    g: { type: "LAB_RESULT", RESULT_ID: "G1", ORDER_ID: "O1", TEST_CODE: "LK-EGFR21", VALUE_TEXT: ">90", VALUE_NUM: 9999999, UNIT_CODE: "mL/min/1.73m2", RESULT_STATUS: "F" },
    k: { type: "LAB_RESULT", RESULT_ID: "K1", ORDER_ID: "O2", TEST_CODE: "LK-K", VALUE_TEXT: "4.0", VALUE_NUM: 4, UNIT_CODE: "mmol/L", RESULT_STATUS: "F" },
    p: { type: "LAB_RESULT", RESULT_ID: "P1", ORDER_ID: "O3", TEST_CODE: "LK-PLT", VALUE_TEXT: "212", VALUE_NUM: 212, UNIT_CODE: "K/uL", RESULT_STATUS: "P" },
    l: { type: "LAB_RESULT", RESULT_ID: "X1", ORDER_ID: "O3", TEST_CODE: "LK-LDLC", VALUE_TEXT: "Not calculated: TG >400", VALUE_NUM: null, UNIT_CODE: null, RESULT_STATUS: "X" },
  }},
  { ...base, id: "V1", effective: "2022-01-05T09:00:00-06:00", recorded: "2022-01-05T18:00:00-06:00", payload: {
    v: { type: "CLINIC_VISIT", VISIT_ID: "NV1", VISIT_TYPE: "FU", VISIT_AT: "2022-01-05T09:00:00-06:00" },
    d1: { type: "VISIT_DX", VISIT_ID: "NV1", ICD10CM: "E87.5", DX_TEXT: "Hyperkalemia", DX_STATUS: "P" },
    d2: { type: "VISIT_DX", VISIT_ID: "NV1", ICD10CM: "T46.4X5A", DX_TEXT: "Adverse effect of angiotensin-converting-enzyme inhibitors, initial encounter", DX_STATUS: "A" },
    m1: { type: "MED_ORDER", RX_ID: "RX1", VISIT_ID: "NV1", LV_DRUG_ID: "D1", DRUG_NAME: "losartan potassium 50 mg tablet", DOSE_QTY: 50, DOSE_UNIT: "mg", ROUTE: "PO", FREQ_CODE: "QD", MED_STATUS: 1, START_DATE: "2022-01-06" },
    m2: { type: "MED_ORDER", RX_ID: "RX2", VISIT_ID: "NV1", LV_DRUG_ID: "D2", DRUG_NAME: "empagliflozin 10 mg tablet", DOSE_QTY: 10, DOSE_UNIT: "mg", ROUTE: "PO", FREQ_CODE: "QD", MED_STATUS: 9, START_DATE: "2022-01-06" },
    bs1: { type: "VITAL", VISIT_ID: "NV1", VITAL_CODE: "BPS", VALUE_NUM: 150, UNIT_CODE: "mmHg", READING_NO: 1, TAKEN_AT: "2022-01-05T09:04:00-06:00" },
    bd1: { type: "VITAL", VISIT_ID: "NV1", VITAL_CODE: "BPD", VALUE_NUM: 90, UNIT_CODE: "mmHg", READING_NO: 1, TAKEN_AT: "2022-01-05T09:04:00-06:00" },
    bs2: { type: "VITAL", VISIT_ID: "NV1", VITAL_CODE: "BPS", VALUE_NUM: 140, UNIT_CODE: "mmHg", READING_NO: 2, TAKEN_AT: "2022-01-05T09:20:00-06:00" },
    bd2: { type: "VITAL", VISIT_ID: "NV1", VITAL_CODE: "BPD", VALUE_NUM: 85, UNIT_CODE: "mmHg", READING_NO: 2, TAKEN_AT: "2022-01-05T09:20:00-06:00" },
  }},
  { ...base, id: "V2", effective: "2022-02-05T09:00:00-06:00", recorded: "2022-02-05T18:00:00-06:00", payload: {
    v: { type: "CLINIC_VISIT", VISIT_ID: "NV2", VISIT_TYPE: "TEL", VISIT_AT: "2022-02-05T09:00:00-06:00" },
    h: { type: "MED_STATUS_HIST", HIST_ID: "H1", VISIT_ID: "NV2", RX_ID: "RX1", OLD_STATUS: 1, NEW_STATUS: 2, CHANGED_AT: "2022-02-05T23:30:00-06:00", REASON_CODE: "ADR", COMMENT_TEXT: "dizzy" },
  }},
];
console.log(JSON.stringify(transform(items as any, "2026-01-01"), null, 1));
