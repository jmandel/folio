import { transform } from "./transform.ts";
const base = { folio: "0.1", issuer: "did:web:x", patient: "p", narrative: "" };
const items: any[] = [
  { ...base, id: "A", effective: "2022-02-01T10:00:00-06:00", recorded: "2022-02-01T23:30:00-06:00", payload: {
    v: { type: "CLINIC_VISIT", VISIT_ID: "V1", VISIT_TYPE: "FU", VISIT_AT: "2022-02-01T10:00:00-06:00", CKD_G: "G3b" },
    rx1: { type: "MED_ORDER", RX_ID: "R1", VISIT_ID: "V1", LV_DRUG_ID: "L1", DRUG_NAME: "Jardiance 10 mg tablet", DOSE_QTY: 10, DOSE_UNIT: "mg", ROUTE: "PO", FREQ_CODE: "QD", MED_STATUS: 1, START_DATE: "2022-02-02" },
    rx2: { type: "MED_ORDER", RX_ID: "R2", VISIT_ID: "V1", LV_DRUG_ID: "L2", DRUG_NAME: "losartan potassium 50 mg tablet", DOSE_QTY: 50, DOSE_UNIT: "mg", ROUTE: "PO", FREQ_CODE: "QD", MED_STATUS: 1, START_DATE: "2022-02-02" },
    rx3: { type: "MED_ORDER", RX_ID: "R3", VISIT_ID: "V1", LV_DRUG_ID: "L3", DRUG_NAME: "iron sucrose 200 mg", DOSE_QTY: 200, DOSE_UNIT: "mg", ROUTE: "IV", FREQ_CODE: "QW", MED_STATUS: 1, START_DATE: "2022-02-02" },
    w1: { type: "VITAL", VISIT_ID: "V1", VITAL_CODE: "BPS", VALUE_NUM: 150, UNIT_CODE: "mmHg", READING_NO: 1, TAKEN_AT: "2022-02-01T10:05:00-06:00" },
    w2: { type: "VITAL", VISIT_ID: "V1", VITAL_CODE: "BPS", VALUE_NUM: 140, UNIT_CODE: "mmHg", READING_NO: 2, TAKEN_AT: "2022-02-01T10:25:00-06:00" },
    w3: { type: "VITAL", VISIT_ID: "V1", VITAL_CODE: "BPD", VALUE_NUM: 90, UNIT_CODE: "mmHg", READING_NO: 1, TAKEN_AT: "2022-02-01T10:05:00-06:00" },
    w4: { type: "VITAL", VISIT_ID: "V1", VITAL_CODE: "BPD", VALUE_NUM: 85, UNIT_CODE: "mmHg", READING_NO: 2, TAKEN_AT: "2022-02-01T10:25:00-06:00" },
  } },
  { ...base, id: "B", effective: "2022-05-01T10:00:00-05:00", recorded: "2022-05-01T12:00:00-05:00", payload: {
    v: { type: "CLINIC_VISIT", VISIT_ID: "V2", VISIT_TYPE: "TEL", VISIT_AT: "2022-05-01T10:00:00-05:00" },
    d1: { type: "VISIT_DX", VISIT_ID: "V2", DX_RANK: 1, ICD10CM: "E87.2", DX_TEXT: "Acidosis", DX_STATUS: "A" },
    d2: { type: "VISIT_DX", VISIT_ID: "V2", DX_RANK: 2, ICD10CM: "T38.6X5A", DX_TEXT: "Adverse effect of SGLT2 inhibitor, initial encounter", DX_STATUS: "A" },
    d3: { type: "VISIT_DX", VISIT_ID: "V2", DX_RANK: 3, ICD10CM: "N17.9", DX_TEXT: "AKI", DX_STATUS: "R" },
    h1: { type: "MED_STATUS_HIST", HIST_ID: "H1", VISIT_ID: "V2", RX_ID: "R1", OLD_STATUS: 1, NEW_STATUS: 2, CHANGED_AT: "2022-05-01T10:10:00-05:00", REASON_CODE: "ADR", COMMENT_TEXT: "euglycemic DKA" },
    h2: { type: "MED_STATUS_HIST", HIST_ID: "H2", VISIT_ID: "V2", RX_ID: "R2", OLD_STATUS: 1, NEW_STATUS: 3, CHANGED_AT: "2022-05-01T10:10:00-05:00", REASON_CODE: "LAB" },
  } },
  { ...base, id: "C", effective: "2022-06-01T10:00:00-05:00", recorded: "2022-06-01T12:00:00-05:00", payload: {
    h3: { type: "MED_STATUS_HIST", HIST_ID: "H3", VISIT_ID: "V3", RX_ID: "R2", OLD_STATUS: 3, NEW_STATUS: 1, CHANGED_AT: "2022-06-01T10:10:00-05:00", REASON_CODE: "OTH" },
  } },
];
console.log(JSON.stringify(transform(items, "2022-02-01"), null, 1).length);
const r = transform(items, "2026-01-01");
console.log(JSON.stringify({ ...r, vitals: r.vitals.map(v => ({ ...v, evidence: v.evidence.length })) }, null, 1));
console.log(transform(items, "2022-01-31").vitals.length, transform(items, "2022-05-15").medications.map(m => m.status));
