---
folio: "0.1"
id: "01GFY4E4V0WK7TRSBDT8GW5051"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00347581"
effective: "2022-10-21T11:10:00-05:00"
recorded: "2022-10-21T15:41:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels fine.

BP 132/74, pulse 77, wt 213 lb.
Labs today: eGFR 64, K 4.2, UACR 20 mg/g, A1c 8.2%, LDL 163.

A1c above goal. Dulaglutide started 0.5 mg weekly today (A1c 8.2). Injection technique shown to pt.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-102174",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-102174",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-102174",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
