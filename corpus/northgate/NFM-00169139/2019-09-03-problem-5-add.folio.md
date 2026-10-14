---
folio: "0.1"
id: "01DKVNRP20N7FYZYRFWHX0RADH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00169139"
effective: "2019-09-03"
recorded: "2019-09-03T08:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Heart failure with reduced ejection fraction.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16891",
    "action": "add",
    "description": "Heart failure with reduced ejection fraction",
    "icd10cm": "I50.22",
    "onset": { "date": "2016-01-01", "precision": "month" },
    "visit_id": "V-2019-090356"
  }
}
```
