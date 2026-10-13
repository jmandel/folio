---
folio: "0.1"
id: "01GCSN1EE0VVD0CW2AK5WSS34H"
issuer: "did:web:lakeview-labs.example"
patient: "LV-0072914"
effective: "2022-09-12T08:05:00-05:00"
recorded: "2022-09-12T15:07:52-05:00"
schema:
  url: "https://lakeview-labs.example/folio/schemas/lakeview-v1.d.ts"
  type: "LabReportRow"
  sha256: "b823507917ec647381f06ddbfc088123747e9ca94e38173b0dc2a3203d0868ad"
supersedes:
  - "01GCS992FRPWC6MKC8C79DYZY4"
---

```json payload
{
  "req": {
    "type": "LAB_REQ",
    "REQ_ID": "RQ-2209120412",
    "CLIENT_CODE": "NGFM",
    "CLIENT_NAME": "Northgate Family Medicine",
    "ORDERING_NPI": "1999000017",
    "ORDERING_NAME": "Reyes, Teresa MD",
    "COLLECTED_AT": "2022-09-12T08:05:00-05:00",
    "RECEIVED_AT": "2022-09-12T09:31:00-05:00",
    "FASTING": "U"
  },
  "ord_k": {
    "type": "LAB_ORDER",
    "ORDER_ID": "OR-6604187",
    "REQ_ID": "RQ-2209120412",
    "ORDER_CODE": "LK-K",
    "ORDER_NAME": "Potassium",
    "ACCESSION": "LV22-255-00412",
    "SPECIMEN_TYPE": "SER",
    "SPECIMEN_COND": "HEM",
    "ORDER_STATUS": 4,
    "STATUS_AT": "2022-09-12T11:40:00-05:00"
  },
  "res_k": {
    "type": "LAB_RESULT",
    "RESULT_ID": "RS-71229904",
    "ORDER_ID": "OR-6604187",
    "TEST_CODE": "LK-K",
    "TEST_NAME": "Potassium, serum",
    "VALUE_TEXT": "6.1",
    "VALUE_NUM": 6.1,
    "UNIT_CODE": "mmol/L",
    "REF_RANGE_TEXT": "3.5-5.1",
    "ABN_FLAG": "HH",
    "RESULT_STATUS": "C",
    "RESULTED_AT": "2022-09-12T11:40:00-05:00",
    "STATUS_CHANGED_AT": "2022-09-12T15:05:00-05:00",
    "REPLACED_BY_RESULT_ID": "RS-71230566",
    "COMMENT_TEXT": "Specimen hemolyzed; potassium may be falsely elevated. Recollection requested. Called to N. Ortiz RN 11:46. CORRECTED 09/12/22 15:05: result invalidated, see recollected specimen LV22-255-00688."
  }
}
```
