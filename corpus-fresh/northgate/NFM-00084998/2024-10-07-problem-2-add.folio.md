---
folio: "0.1"
id: "01J9KP9TR0VXMKP69ZME052Z38"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00084998"
effective: "2024-10-07"
recorded: "2024-10-07T09:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes, onset 2012 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14605",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2012-01-01", "precision": "year" },
    "visit_id": "V-2024-100787"
  }
}
```
