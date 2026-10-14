---
folio: "0.1"
id: "01DM0W91W0V3E13G6WDMH9GFDE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00922394"
effective: "2019-09-05"
recorded: "2019-09-05T09:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary osteoarthritis of knee, onset 1/2012 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18128",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "onset": { "date": "2012-01-09", "precision": "day" },
    "visit_id": "V-2019-090545"
  }
}
```
