---
folio: "0.1"
id: "01DV6CGXP015MS043NXV0YXZGT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00696353"
effective: "2019-12-03"
recorded: "2019-12-03T11:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes, onset 3/2014 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17764",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2014-03-01", "precision": "month" },
    "visit_id": "V-2019-120347"
  }
}
```
