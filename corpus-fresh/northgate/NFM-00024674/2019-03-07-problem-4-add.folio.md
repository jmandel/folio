---
folio: "0.1"
id: "01D5CJT4P0KYYAJ7RCG3P0WFFQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00024674"
effective: "2019-03-07"
recorded: "2019-03-07T11:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 9/2016.</ref> Added at first visit, history per pt.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16098",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "onset": { "date": "2016-09-01", "precision": "month" },
    "visit_id": "V-2019-030728"
  }
}
```
