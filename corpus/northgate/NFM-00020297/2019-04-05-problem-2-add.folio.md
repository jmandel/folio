---
folio: "0.1"
id: "01D7PXF2W09JAMVBR93SVYP683"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00020297"
effective: "2019-04-05"
recorded: "2019-04-05T09:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes, dx 10/2014 per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11702",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2014-10-01", "precision": "month" },
    "visit_id": "V-2019-040521"
  }
}
```
