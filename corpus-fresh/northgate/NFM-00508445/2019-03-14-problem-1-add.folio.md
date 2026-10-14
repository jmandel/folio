---
folio: "0.1"
id: "01D5Y70B20ZN2GZF80CAG0JEBD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00508445"
effective: "2019-03-14"
recorded: "2019-03-14T08:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2017 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15396",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "onset": { "date": "2017-01-01", "precision": "year" },
    "visit_id": "V-2019-031462"
  }
}
```
