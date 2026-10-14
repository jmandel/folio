---
folio: "0.1"
id: "01M2GAF8T0V0V713K63HSDSQQS"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0072914"
effective: "2026-09-14T08:40:00-05:00"
recorded: "2026-09-14T11:02:16-05:00"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "LabReportRow"
  sha256: "e884e9fb615bfd349db84eb77033d4a6175aa14694e8462cd769a9285a8bb252"
---

```json payload
{
  "req": {
    "type": "LAB_REQ",
    "REQ_ID": "RQ-2609140157",
    "CLIENT_CODE": "LVNEPH",
    "CLIENT_NAME": "Lakeview Kidney Care",
    "ORDERING_NPI": "1999000042",
    "ORDERING_NAME": "Marsh, Helen MD",
    "COLLECTED_AT": "2026-09-14T08:40:00-05:00",
    "RECEIVED_AT": "2026-09-14T09:15:00-05:00",
    "FASTING": "N"
  },
  "ord_creat": {
    "type": "LAB_ORDER",
    "ORDER_ID": "OR-9907731",
    "REQ_ID": "RQ-2609140157",
    "ORDER_CODE": "LK-CREAT",
    "ORDER_NAME": "Creatinine with eGFR",
    "ACCESSION": "LV26-257-00121",
    "SPECIMEN_TYPE": "SER",
    "SPECIMEN_COND": "OK",
    "ORDER_STATUS": 4,
    "STATUS_AT": "2026-09-14T10:55:00-05:00"
  },
  "ord_k": {
    "type": "LAB_ORDER",
    "ORDER_ID": "OR-9907732",
    "REQ_ID": "RQ-2609140157",
    "ORDER_CODE": "LK-K",
    "ORDER_NAME": "Potassium",
    "ACCESSION": "LV26-257-00121",
    "SPECIMEN_TYPE": "SER",
    "SPECIMEN_COND": "OK",
    "ORDER_STATUS": 4,
    "STATUS_AT": "2026-09-14T10:55:00-05:00"
  },
  "res_creat": {
    "type": "LAB_RESULT",
    "RESULT_ID": "RS-99815240",
    "ORDER_ID": "OR-9907731",
    "TEST_CODE": "LK-CREAT",
    "TEST_NAME": "Creatinine, serum",
    "LOINC": "2160-0",
    "VALUE_TEXT": "1.52",
    "VALUE_NUM": 1.52,
    "UNIT_CODE": "mg/dL",
    "REF_RANGE_TEXT": "0.57-1.00",
    "ABN_FLAG": "H",
    "RESULT_STATUS": "F",
    "RESULTED_AT": "2026-09-14T10:55:00-05:00"
  },
  "res_egfr": {
    "type": "LAB_RESULT",
    "RESULT_ID": "RS-99815241",
    "ORDER_ID": "OR-9907731",
    "TEST_CODE": "LK-EGFR21",
    "TEST_NAME": "eGFR",
    "VALUE_TEXT": "39",
    "VALUE_NUM": 39,
    "UNIT_CODE": "mL/min/1.73m2",
    "REF_RANGE_TEXT": ">59",
    "ABN_FLAG": "L",
    "RESULT_STATUS": "F",
    "RESULTED_AT": "2026-09-14T10:55:00-05:00",
    "DERIVED_FROM_RESULT_ID": "RS-99815240",
    "COMMENT_TEXT": "Calculated by CKD-EPI 2021 (race-free) equation."
  },
  "res_k": {
    "type": "LAB_RESULT",
    "RESULT_ID": "RS-99815242",
    "ORDER_ID": "OR-9907732",
    "TEST_CODE": "LK-K",
    "TEST_NAME": "Potassium, serum",
    "LOINC": "2823-3",
    "VALUE_TEXT": "5.8",
    "VALUE_NUM": 5.8,
    "UNIT_CODE": "mmol/L",
    "REF_RANGE_TEXT": "3.5-5.1",
    "ABN_FLAG": "H",
    "RESULT_STATUS": "F",
    "RESULTED_AT": "2026-09-14T10:55:00-05:00",
    "COMMENT_TEXT": "No hemolysis detected. Repeat requested by Dr. Marsh."
  }
}
```
