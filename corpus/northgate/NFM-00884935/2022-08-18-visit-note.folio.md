---
folio: "0.1"
id: "01GAS9EPT0FKRDBBCVM2EQPESV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00884935"
effective: "2022-08-18T09:50:00-05:00"
recorded: "2022-08-18T15:14:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 157/94, pulse 78, wt 165 lb.
Today: eGFR 64, K 4.5, UACR 8 mg/g, LDL 97 mg/dL.
BP above goal, lisinopril dose changed to 40 mg daily today.
Pt agrees. Recheck BP in a few months.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-081816",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-081816",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-081816",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
