---
folio: "0.1"
id: "01DBB5N3H01EZX8KY66WQVHJ8K"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00821886"
effective: "2019-05-20"
recorded: "2019-05-20T12:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 2016 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11991",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "onset": { "date": "2016-01-01", "precision": "year" },
    "restricted": "BH",
    "visit_id": "V-2019-052048"
  }
}
```
