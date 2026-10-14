---
folio: "0.1"
id: "01D6TTH720EE2YAM8B4Q07VQB2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00821220"
effective: "2019-03-25"
recorded: "2019-03-25T11:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes mellitus, onset 2011 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16429",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2011-01-01", "precision": "year" },
    "visit_id": "V-2019-032586"
  }
}
```
