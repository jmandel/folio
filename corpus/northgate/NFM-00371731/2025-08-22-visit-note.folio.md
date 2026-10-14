---
folio: "0.1"
id: "01K39BV8K037GVXVCYRS6F6FK2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00371731"
effective: "2025-08-22T09:10:00-05:00"
recorded: "2025-08-22T12:05:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-082239",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-082239",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
