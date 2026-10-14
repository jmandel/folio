---
folio: "0.1"
id: "01FRGZZKW0Z8529D7ATJNW7PSM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00140901"
effective: "2022-01-03"
recorded: "2022-01-03T16:12:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes mellitus added, onset 2012 per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17529",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2012-01-01", "precision": "year" },
    "visit_id": "V-2022-010373"
  }
}
```
