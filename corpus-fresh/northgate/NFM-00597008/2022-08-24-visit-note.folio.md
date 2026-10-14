---
folio: "0.1"
id: "01GB8QAHF0XHF44FFR1CD4XQNB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00597008"
effective: "2022-08-24T12:45:00-05:00"
recorded: "2022-08-24T15:05:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new symptoms.
BP 142/89, repeat 139/85, pulse 86, wt 190 lb.
8/22 labs: eGFR 58, K 4.3, A1c 6.8%. CKD stage 3a on problem list.
BP above goal, amlodipine started 5 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-082466",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-082466",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-082466",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  }
}
```
