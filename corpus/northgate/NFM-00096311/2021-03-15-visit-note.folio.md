---
folio: "0.1"
id: "01F0VE0TB0WQTFNSP9ZB00T73P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00096311"
effective: "2021-03-15T10:10:00-05:00"
recorded: "2021-03-15T12:13:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
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
    "visit_id": "V-2021-031568",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-031568",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
