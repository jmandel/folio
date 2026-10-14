---
folio: "0.1"
id: "01FRVRQQ70G3W2ER5V7WZQZQNT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00581886"
effective: "2022-01-07T15:15:00-06:00"
recorded: "2022-01-07T20:37:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt and problem list entered today.

BP 138/80, pulse 85, wt 190 lb.

Records to be requested as needed. Questions answered.

RTC to be scheduled.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-010716",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-010716",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-010716",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-010716",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
