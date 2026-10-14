---
folio: "0.1"
id: "01GCSMN7T0P3E1X4CDJ4BMTTTK"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0072914"
effective: "2022-09-12T13:20:00-05:00"
recorded: "2022-09-12T15:01:12-05:00"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "LabReportRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
---

```json payload
{
  "req": {
    "type": "LAB_REQ",
    "REQ_ID": "RQ-2209120731",
    "CLIENT_CODE": "NGFM",
    "CLIENT_NAME": "Northgate Family Medicine",
    "ORDERING_NPI": "1999000017",
    "ORDERING_NAME": "Reyes, Teresa MD",
    "COLLECTED_AT": "2022-09-12T13:20:00-05:00",
    "RECEIVED_AT": "2022-09-12T13:52:00-05:00",
    "FASTING": "U"
  },
  "ord_k": {
    "type": "LAB_ORDER",
    "ORDER_ID": "OR-6604420",
    "REQ_ID": "RQ-2209120731",
    "ORDER_CODE": "LK-K",
    "ORDER_NAME": "Potassium",
    "ACCESSION": "LV22-255-00688",
    "SPECIMEN_TYPE": "SER",
    "SPECIMEN_COND": "OK",
    "ORDER_STATUS": 4,
    "STATUS_AT": "2022-09-12T14:58:00-05:00",
    "REPEAT_OF_ORDER_ID": "OR-6604187",
    "REPEAT_REASON": "HEM"
  },
  "res_k": {
    "type": "LAB_RESULT",
    "RESULT_ID": "RS-71230566",
    "ORDER_ID": "OR-6604420",
    "TEST_CODE": "LK-K",
    "TEST_NAME": "Potassium, serum",
    "VALUE_TEXT": "4.6",
    "VALUE_NUM": 4.6,
    "UNIT_CODE": "mmol/L",
    "REF_RANGE_TEXT": "3.5-5.1",
    "ABN_FLAG": "N",
    "RESULT_STATUS": "F",
    "RESULTED_AT": "2022-09-12T14:58:00-05:00"
  }
}
```
