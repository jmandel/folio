---
folio: "0.1"
id: "01DHKVGC30J6TYQ1C44J0TCW34"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00392719"
effective: "2019-08-06"
recorded: "2019-08-06T11:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary osteoarthritis of knee, onset 2015.</ref> Hx per pt, first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15262",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "onset": { "date": "2015-01-01", "precision": "year" },
    "visit_id": "V-2019-080672"
  }
}
```
