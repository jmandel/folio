---
folio: "0.1"
id: "01HN3Y9SJ0A0PRB5VZ2E6EKMSR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00044351"
effective: "2024-01-26T10:45:00-06:00"
recorded: "2024-01-26T16:30:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. BP 130/80, pulse 76, wt 239 lb.

1/24 labs: eGFR 69, K 4.3, A1c 7.1%.

A1c down further, pt pleased. Continue current plan. RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-012635",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-012635",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-012635",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
