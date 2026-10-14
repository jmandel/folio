import { transform } from "./transform.ts";
const base = { folio: "0.1", issuer: "x", patient: "p", narrative: "" };
const items: any[] = [
  { ...base, id: "A", effective: "2024-03-10T08:00:00", recorded: "2024-03-10T09:00:00Z", payload: {
    v: { type: "CLINIC_VISIT", VISIT_ID: "V1", VISIT_TYPE: "FU", VISIT_AT: "2024-03-10T08:00:00" },
    d1: { type: "VISIT_DX", VISIT_ID: "V1", DX_RANK: 1, ICD10CM: "E87.5", DX_TEXT: "Hyperkalemia", DX_STATUS: "A" },
    d2: { type: "VISIT_DX", VISIT_ID: "V1", DX_RANK: 2, ICD10CM: "T50.0X5A", DX_TEXT: "Adverse effect of mineralocorticoids and their antagonists, initial encounter", DX_STATUS: "A" },
    d3: { type: "VISIT_DX", VISIT_ID: "V1", DX_RANK: 3, ICD10CM: "R80.9", DX_TEXT: "Proteinuria", DX_STATUS: "P" },
    rx: { type: "MED_ORDER", RX_ID: "R1", VISIT_ID: "V1", LV_DRUG_ID: "x", DRUG_NAME: "spironolactone 25 mg tablet", DOSE_QTY: 25, DOSE_UNIT: "mg", ROUTE: "PO", FREQ_CODE: "QD", MED_STATUS: 1, START_DATE: "2024-01", PRESCRIBER_NPI: "1" },
    h: { type: "MED_STATUS_HIST", HIST_ID: "H", VISIT_ID: "V1", RX_ID: "R1", OLD_STATUS: 1, NEW_STATUS: 2, CHANGED_AT: "2024-03-10T03:00:00Z", REASON_CODE: "ADR", COMMENT_TEXT: "hyperkalemia" },
    b1: { type: "VITAL", VISIT_ID: "V1", VITAL_CODE: "BPS", VALUE_NUM: 150, UNIT_CODE: "mmHg", READING_NO: 1, TAKEN_AT: "2024-03-10T08:05:00" },
    b2: { type: "VITAL", VISIT_ID: "V1", VITAL_CODE: "BPS", VALUE_NUM: 140, UNIT_CODE: "mmHg", READING_NO: 2, TAKEN_AT: "2024-03-10T08:15:00" },
  }},
  { ...base, id: "B", effective: "2024-03-11", recorded: "2024-03-11T10:00:00-05:00", retracts: ["A"], payload: {} },
  { ...base, id: "L", effective: "2024-03-10T08:30:00", recorded: "2024-03-10T12:00:00", payload: {
    q: { type: "LAB_REQ", REQ_ID: "Q", COLLECTED_AT: "2024-03-10T08:30:00" },
    o: { type: "LAB_ORDER", ORDER_ID: "O", REQ_ID: "Q", ORDER_STATUS: 4 },
    r: { type: "LAB_RESULT", RESULT_ID: "R", ORDER_ID: "O", TEST_CODE: "LK-EGFR21", VALUE_TEXT: ">90", VALUE_NUM: null, UNIT_CODE: "mL/min/1.73m2", RESULT_STATUS: "P" },
    g: { type: "LAB_RESULT", RESULT_ID: "G", ORDER_ID: "O", TEST_CODE: "LK-GLU", VALUE_TEXT: "5.5", VALUE_NUM: 5.5, UNIT_CODE: "mmol/L", RESULT_STATUS: "F" },
  }},
];
console.log(JSON.stringify(transform(items, "2024-03-10"), null, 1));
console.log(JSON.stringify(transform(items, "2024-03-11").problems.length));
