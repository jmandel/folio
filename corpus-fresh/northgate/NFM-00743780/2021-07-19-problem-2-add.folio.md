---
folio: "0.1"
id: "01FB096PA0QBRGVBJ58XR4RHG8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00743780"
effective: "2021-07-19"
recorded: "2021-07-19T16:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">DM2, onset 2010.</ref> Added at first visit, hx per pt.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17745",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2010-01-01", "precision": "year" },
    "visit_id": "V-2021-071964"
  }
}
```
