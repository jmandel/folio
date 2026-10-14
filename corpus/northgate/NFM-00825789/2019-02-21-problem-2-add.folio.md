---
folio: "0.1"
id: "01D48VHNJ0XRQRWXENP6RG6NQA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00825789"
effective: "2019-02-21"
recorded: "2019-02-21T14:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes mellitus, onset 2014 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16580",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2014-01-01", "precision": "year" },
    "visit_id": "V-2019-022136"
  }
}
```
