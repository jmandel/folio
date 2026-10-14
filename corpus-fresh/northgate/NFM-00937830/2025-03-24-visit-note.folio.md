---
folio: "0.1"
id: "01JQ4VAP50V7ZAGH17AEJBJC0E"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00937830"
effective: "2025-03-24T09:45:00-05:00"
recorded: "2025-03-24T14:51:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. A1c 8.6, above goal.

BP 125/76, pulse 78, wt 211 lb.

Insulin glargine started today, 10 units at bedtime. Reviewed injection technique and low sugar symptoms with pt.

RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-032422",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-032422",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
