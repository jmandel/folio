---
folio: "0.1"
id: "01D1Y8A2A03A8G8PQAHPMABE6G"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00258113"
effective: "2019-01-23"
recorded: "2019-01-23T15:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary OA of knee, onset 2017 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19174",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "onset": { "date": "2017-01-01", "precision": "year" },
    "visit_id": "V-2019-012313"
  }
}
```
