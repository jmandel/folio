---
folio: "0.1"
id: "01D59RD2J03HC56VR2MN6EN10D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00493571"
effective: "2019-03-06"
recorded: "2019-03-06T09:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 2008.</ref> Hx per pt, first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12519",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "onset": { "date": "2008-01-01", "precision": "year" },
    "visit_id": "V-2019-030683"
  }
}
```
