---
folio: "0.1"
id: "01GJRNAYM0KAKAGHEJ86CH1WN5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00713158"
effective: "2022-11-25T13:30:00-06:00"
recorded: "2022-11-25T18:28:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New patient, establish care.

insulin glargine: started 10 units at bedtime today (A1c 9.1)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-112574",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-112574",
    "rank": 1,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
