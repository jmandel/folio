---
folio: "0.1"
id: "01KH25JH7RESV96C4ES94XQ7AK"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0072914"
effective: "2026-02-09T08:14:00-06:00"
recorded: "2026-02-09T15:40:27-06:00"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "LabReportRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---

```json payload
{
  "req": {
    "type": "LAB_REQ",
    "REQ_ID": "RQ-2602090412",
    "CLIENT_CODE": "NGFM",
    "CLIENT_NAME": "Northgate Family Medicine",
    "ORDERING_NPI": "1999000017",
    "ORDERING_NAME": "Reyes, Teresa MD",
    "COLLECTED_AT": "2026-02-09T08:14:00-06:00",
    "RECEIVED_AT": "2026-02-09T09:25:00-06:00",
    "FASTING": "Y"
  },
  "ord_creat": {
    "type": "LAB_ORDER",
    "ORDER_ID": "OR-9420311",
    "REQ_ID": "RQ-2602090412",
    "ORDER_CODE": "LK-CREAT",
    "ORDER_NAME": "Creatinine with eGFR",
    "ACCESSION": "LV26-040-00093",
    "SPECIMEN_TYPE": "SER",
    "SPECIMEN_COND": "OK",
    "ORDER_STATUS": 4,
    "STATUS_AT": "2026-02-09T11:06:00-06:00"
  },
  "ord_na": {
    "type": "LAB_ORDER",
    "ORDER_ID": "OR-9420312",
    "REQ_ID": "RQ-2602090412",
    "ORDER_CODE": "LK-NA",
    "ORDER_NAME": "Sodium",
    "ACCESSION": "LV26-040-00093",
    "SPECIMEN_TYPE": "SER",
    "SPECIMEN_COND": "OK",
    "ORDER_STATUS": 4,
    "STATUS_AT": "2026-02-09T11:06:00-06:00"
  },
  "ord_k": {
    "type": "LAB_ORDER",
    "ORDER_ID": "OR-9420315",
    "REQ_ID": "RQ-2602090412",
    "ORDER_CODE": "LK-K",
    "ORDER_NAME": "Potassium",
    "ACCESSION": "LV26-040-00093",
    "SPECIMEN_TYPE": "SER",
    "SPECIMEN_COND": "OK",
    "ORDER_STATUS": 4,
    "STATUS_AT": "2026-02-09T11:06:00-06:00"
  },
  "ord_uacr": {
    "type": "LAB_ORDER",
    "ORDER_ID": "OR-9420313",
    "REQ_ID": "RQ-2602090412",
    "ORDER_CODE": "LK-UACR",
    "ORDER_NAME": "Albumin/creatinine ratio, urine",
    "ACCESSION": "LV26-040-00094",
    "SPECIMEN_TYPE": "URN",
    "SPECIMEN_COND": "OK",
    "ORDER_STATUS": 4,
    "STATUS_AT": "2026-02-09T15:33:00-06:00"
  },
  "ord_a1c": {
    "type": "LAB_ORDER",
    "ORDER_ID": "OR-9420314",
    "REQ_ID": "RQ-2602090412",
    "ORDER_CODE": "LK-A1C",
    "ORDER_NAME": "Hemoglobin A1c",
    "ACCESSION": "LV26-040-00095",
    "SPECIMEN_TYPE": "WB",
    "SPECIMEN_COND": "OK",
    "ORDER_STATUS": 4,
    "STATUS_AT": "2026-02-09T12:52:00-06:00"
  },
  "res_creat": {
    "type": "LAB_RESULT",
    "RESULT_ID": "RS-97710450",
    "ORDER_ID": "OR-9420311",
    "TEST_CODE": "LK-CREAT",
    "TEST_NAME": "Creatinine, serum",
    "LOINC": "2160-0",
    "VALUE_TEXT": "1.45",
    "VALUE_NUM": 1.45,
    "UNIT_CODE": "mg/dL",
    "REF_RANGE_TEXT": "0.57-1.00",
    "ABN_FLAG": "H",
    "RESULT_STATUS": "F",
    "RESULTED_AT": "2026-02-09T11:06:00-06:00"
  },
  "res_egfr": {
    "type": "LAB_RESULT",
    "RESULT_ID": "RS-97710451",
    "ORDER_ID": "OR-9420311",
    "TEST_CODE": "LK-EGFR21",
    "TEST_NAME": "eGFR",
    "VALUE_TEXT": "41",
    "VALUE_NUM": 41,
    "UNIT_CODE": "mL/min/1.73m2",
    "REF_RANGE_TEXT": ">59",
    "ABN_FLAG": "L",
    "RESULT_STATUS": "F",
    "RESULTED_AT": "2026-02-09T11:06:00-06:00",
    "DERIVED_FROM_RESULT_ID": "RS-97710450",
    "COMMENT_TEXT": "Calculated by CKD-EPI 2021 (race-free) equation."
  },
  "res_na": {
    "type": "LAB_RESULT",
    "RESULT_ID": "RS-97710452",
    "ORDER_ID": "OR-9420312",
    "TEST_CODE": "LK-NA",
    "TEST_NAME": "Sodium, serum",
    "LOINC": "2951-2",
    "VALUE_TEXT": "132",
    "VALUE_NUM": 132,
    "UNIT_CODE": "mmol/L",
    "REF_RANGE_TEXT": "134-144",
    "ABN_FLAG": "L",
    "RESULT_STATUS": "F",
    "RESULTED_AT": "2026-02-09T11:06:00-06:00"
  },
  "res_k": {
    "type": "LAB_RESULT",
    "RESULT_ID": "RS-97710453",
    "ORDER_ID": "OR-9420315",
    "TEST_CODE": "LK-K",
    "TEST_NAME": "Potassium, serum",
    "LOINC": "2823-3",
    "VALUE_TEXT": "4.6",
    "VALUE_NUM": 4.6,
    "UNIT_CODE": "mmol/L",
    "REF_RANGE_TEXT": "3.5-5.1",
    "ABN_FLAG": "N",
    "RESULT_STATUS": "F",
    "RESULTED_AT": "2026-02-09T11:06:00-06:00"
  },
  "res_uacr": {
    "type": "LAB_RESULT",
    "RESULT_ID": "RS-97711873",
    "ORDER_ID": "OR-9420313",
    "TEST_CODE": "LK-UACR",
    "TEST_NAME": "Albumin/Creatinine Ratio, Urine",
    "LOINC": "9318-7",
    "VALUE_TEXT": "320",
    "VALUE_NUM": 320,
    "UNIT_CODE": "mg/g",
    "REF_RANGE_TEXT": "<30",
    "ABN_FLAG": "H",
    "RESULT_STATUS": "F",
    "RESULTED_AT": "2026-02-09T15:33:00-06:00"
  },
  "res_a1c": {
    "type": "LAB_RESULT",
    "RESULT_ID": "RS-97711102",
    "ORDER_ID": "OR-9420314",
    "TEST_CODE": "LK-A1C",
    "TEST_NAME": "Hemoglobin A1c",
    "LOINC": "4548-4",
    "VALUE_TEXT": "8.2",
    "VALUE_NUM": 8.2,
    "UNIT_CODE": "%",
    "REF_RANGE_TEXT": "4.0-5.6",
    "ABN_FLAG": "H",
    "RESULT_STATUS": "F",
    "RESULTED_AT": "2026-02-09T12:52:00-06:00"
  }
}
```
