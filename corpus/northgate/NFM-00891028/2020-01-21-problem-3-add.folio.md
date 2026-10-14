---
folio: "0.1"
id: "01DZ4ZQK60FT60XD5P3NS5R6B0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00891028"
effective: "2020-01-21"
recorded: "2020-01-21T15:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17988",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2018-01-01", "precision": "year" },
    "visit_id": "V-2020-012182"
  }
}
```
