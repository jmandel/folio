---
folio: "0.1"
id: "01DQT7TQP0NK585JGQW88SRYST"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00005230"
effective: "2019-10-22"
recorded: "2019-10-22T12:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes, onset 4/2008.</ref> Hx per pt, added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14352",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2008-04-01", "precision": "month" },
    "visit_id": "V-2019-102222"
  }
}
```
