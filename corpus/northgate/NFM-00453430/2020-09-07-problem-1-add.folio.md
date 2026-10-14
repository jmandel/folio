---
folio: "0.1"
id: "01EHMW90C0NZY72C59D7TB9J92"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00453430"
effective: "2020-09-07"
recorded: "2020-09-07T13:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11657",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2016-01-01", "precision": "year" },
    "visit_id": "V-2020-090763"
  }
}
```
