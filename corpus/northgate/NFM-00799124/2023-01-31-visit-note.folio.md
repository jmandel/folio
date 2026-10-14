---
folio: "0.1"
id: "01GR4J5J6038Q22436T9MQP1T4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00799124"
effective: "2023-01-31T10:20:00-06:00"
recorded: "2023-01-31T12:42:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. Records reviewed with pt, history per pt.
BP 117/74, pulse 75, wt 198 lb.
Labs today: eGFR 53, K 5.
Feels well, no new complaints. Will recheck labs and see how BP does.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-013185",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-013185",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-013185",
    "rank": 2,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
