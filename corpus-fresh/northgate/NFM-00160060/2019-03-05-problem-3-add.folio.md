---
folio: "0.1"
id: "01D57SR2D09H8AW0RKWYBCMSBS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00160060"
effective: "2019-03-05"
recorded: "2019-03-05T14:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 2013 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11127",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "onset": { "date": "2013-01-01", "precision": "year" },
    "visit_id": "V-2019-030566"
  }
}
```
