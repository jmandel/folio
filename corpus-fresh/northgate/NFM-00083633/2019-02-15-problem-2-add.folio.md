---
folio: "0.1"
id: "01D3S2VRP0GMEMPDY7BSMXNE23"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00083633"
effective: "2019-02-15"
recorded: "2019-02-15T11:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes, onset 7/2013.</ref> History per pt, added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12886",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2013-07-13", "precision": "day" },
    "visit_id": "V-2019-021581"
  }
}
```
