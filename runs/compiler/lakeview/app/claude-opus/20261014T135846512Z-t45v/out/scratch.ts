import { transform } from "./transform.ts";
const base = { folio: "0.1", issuer: "did:web:x", patient: "p", narrative: "" };
const items: any[] = [
  { ...base, id: "L1", effective: "2021-03-01T08:00:00-06:00", recorded: "2021-03-01T23:30:00-06:00", payload: {
    req: { type: "LAB_REQ", REQ_ID: "RQ1", COLLECTED_AT: "2021-03-01T08:00:00-06:00" },
    o1: { type: "LAB_ORDER", ORDER_ID: "O1", REQ_ID: "RQ1", ORDER_STATUS: 4 },
    o2: { type: "LAB_ORDER", ORDER_ID: "O2", REQ_ID: "RQ1", ORDER_STATUS: 9 },
    e: { type: "LAB_RESULT", RESULT_ID: "R1", ORDER_ID: "O1", TEST_CODE: "LK-EGFR09N", VALUE_TEXT: ">60", VALUE_NUM: 9999999, UNIT_CODE: "mL/min/1.73m2", RESULT_STATUS: "F", LOINC: "48642-3" },
    p: { type: "LAB_RESULT", RESULT_ID: "R2", ORDER_ID: "O1", TEST_CODE: "LK-PLT", VALUE_TEXT: "212", VALUE_NUM: 212, UNIT_CODE: "K/uL", RESULT_STATUS: "P" },
    v: { type: "LAB_RESULT", RESULT_ID: "R3", ORDER_ID: "O2", TEST_CODE: "LK-K", VALUE_TEXT: "4.1", VALUE_NUM: 4.1, UNIT_CODE: "mmol/L", RESULT_STATUS: "F" },
    x: { type: "LAB_RESULT", RESULT_ID: "R4", ORDER_ID: "O1", TEST_CODE: "LK-LDLC", VALUE_TEXT: "Not calculated: TG >400", VALUE_NUM: null, UNIT_CODE: null, RESULT_STATUS: "X" },
  } },
  { ...base, id: "C1", effective: "2022-01-01T10:00:00-06:00", recorded: "2022-01-01T12:00:00-06:00", payload: {
    visit: { type: "CLINIC_VISIT", VISIT_ID: "V1", VISIT_AT: "2022-01-01T10:00:00-06:00" },
    rx1: { type: "MED_ORDER", RX_ID: "RX1", VISIT_ID: "V1", DRUG_NAME: "losartan potassium 50 mg tablet", DOSE_QTY: 50, DOSE_UNIT: "mg", ROUTE: "PO", FREQ_CODE: "QD", MED_STATUS: 1, START_DATE: "2022-01-02" },
    rx2: { type: "MED_ORDER", RX_ID: "RX2", VISIT_ID: "V1", DRUG_NAME: "empagliflozin 10 mg tablet", DOSE_QTY: 10, DOSE_UNIT: "mg", ROUTE: "PO", FREQ_CODE: "QD", MED_STATUS: 1, START_DATE: "2022-01-02" },
    rx3: { type: "MED_ORDER", RX_ID: "RX3", VISIT_ID: "V1", DRUG_NAME: "insulin glargine 100 unit/mL pen", DOSE_QTY: 20, DOSE_UNIT: "unit", ROUTE: "SC", FREQ_CODE: "QHS", MED_STATUS: 1, START_DATE: "2022-01-02" },
    bps: { type: "VITAL", VISIT_ID: "V1", VITAL_CODE: "BPS", VALUE_NUM: 150, UNIT_CODE: "mmHg", READING_NO: 1, TAKEN_AT: "2022-01-01T16:05:00Z" },
    bpd: { type: "VITAL", VISIT_ID: "V1", VITAL_CODE: "BPD", VALUE_NUM: 90, UNIT_CODE: "mmHg", READING_NO: 1, TAKEN_AT: "2022-01-01T16:05:00Z" },
    bps2: { type: "VITAL", VISIT_ID: "V1", VITAL_CODE: "BPS", VALUE_NUM: 140, UNIT_CODE: "mmHg", READING_NO: 2, TAKEN_AT: "2022-01-01T16:20:00Z" },
    bpd2: { type: "VITAL", VISIT_ID: "V1", VITAL_CODE: "BPD", VALUE_NUM: 85, UNIT_CODE: "mmHg", READING_NO: 2, TAKEN_AT: "2022-01-01T16:20:00Z" },
  } },
  { ...base, id: "C2", effective: "2022-03-01T10:00:00-06:00", recorded: "2022-03-01T12:00:00-06:00", payload: {
    visit: { type: "CLINIC_VISIT", VISIT_ID: "V2", VISIT_AT: "2022-03-01T10:00:00-06:00", CKD_G: "G3b" },
    h1: { type: "MED_STATUS_HIST", HIST_ID: "H1", VISIT_ID: "V2", RX_ID: "RX1", OLD_STATUS: 1, NEW_STATUS: 9, CHANGED_AT: "2022-03-01T10:10:00-06:00", REASON_CODE: "ERR" },
    h2: { type: "MED_STATUS_HIST", HIST_ID: "H2", VISIT_ID: "V2", RX_ID: "RX2", OLD_STATUS: 1, NEW_STATUS: 2, CHANGED_AT: "2022-03-01T10:10:00-06:00", REASON_CODE: "ADR", COMMENT_TEXT: "euglycemic DKA" },
    d1: { type: "VISIT_DX", VISIT_ID: "V2", DX_RANK: 1, ICD10CM: "E11.10", DX_TEXT: "Type 2 diabetes mellitus with ketoacidosis without coma", DX_STATUS: "A" },
    d2: { type: "VISIT_DX", VISIT_ID: "V2", DX_RANK: 2, ICD10CM: "T38.3X5A", DX_TEXT: "Adverse effect of insulin and oral hypoglycemic drugs, initial encounter", DX_STATUS: "A" },
    d3: { type: "VISIT_DX", VISIT_ID: "V2", DX_RANK: 3, ICD10CM: "N18.32", DX_TEXT: "CKD 3b", DX_STATUS: "A" },
    d4: { type: "VISIT_DX", VISIT_ID: "V2", DX_RANK: 4, ICD10CM: "E87.5", DX_TEXT: "Hyperkalemia", DX_STATUS: "R" },
  } },
];
for (const a of ["2021-03-01", "2022-01-01", "2026-01-01"]) console.log(a, JSON.stringify(transform(items, a), null, 1));
