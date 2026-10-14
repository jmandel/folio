---
folio: "0.1"
id: "01E3T9BGB0HT9HC56VZ9HH67PV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00230551"
effective: "2020-03-19T12:10:00-05:00"
recorded: "2020-03-19T15:57:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History of HTN, DM2 and obesity per pt.
BP 132/84, pulse 74, wt 217 lb.
Labs today: A1c 7.2%, eGFR 57, K 3.7, UACR 83 mg/g, LDL 138 mg/dL.
Reviewed results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-031915",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-031915",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
