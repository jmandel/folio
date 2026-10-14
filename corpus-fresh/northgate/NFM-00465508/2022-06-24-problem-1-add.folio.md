---
folio: "0.1"
id: "01G6BGX140PNHH0P555W7W43KZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00465508"
effective: "2022-06-24"
recorded: "2022-06-24T13:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia added, onset 3/2013 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18746",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2013-03-20", "precision": "day" },
    "visit_id": "V-2022-062454"
  }
}
```
