---
folio: "0.1"
id: "01GR9TZ5R0HTCKZJBP9K7RMV7C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00235856"
effective: "2023-02-02"
recorded: "2023-02-02T13:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 2017 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11437",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2017-01-01", "precision": "year" },
    "visit_id": "V-2023-020292"
  }
}
```
