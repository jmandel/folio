---
folio: "0.1"
id: "01GM8QN100EA49S1FVD1N7CSER"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00701971"
effective: "2022-12-14"
recorded: "2022-12-14T10:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 7/2019 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15468",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2019-07-01", "precision": "month" },
    "visit_id": "V-2022-121464"
  }
}
```
