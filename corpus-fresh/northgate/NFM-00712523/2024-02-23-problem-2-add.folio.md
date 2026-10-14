---
folio: "0.1"
id: "01HQBDGPY0TSBCSW4WNA8XKHEZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00712523"
effective: "2024-02-23"
recorded: "2024-02-23T10:42:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes, dx 10/2015 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15558",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2015-10-01", "precision": "month" },
    "visit_id": "V-2024-022375"
  }
}
```
