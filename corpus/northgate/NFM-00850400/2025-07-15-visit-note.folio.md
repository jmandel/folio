---
folio: "0.1"
id: "01K085Z8W0S9AF80YBWF6D5520"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00850400"
effective: "2025-07-15T13:20:00-05:00"
recorded: "2025-07-15T18:16:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Diabetes follow-up.

insulin glargine: started 10 units at bedtime today (A1c 8.8)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-071541",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-071541",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-071541",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
