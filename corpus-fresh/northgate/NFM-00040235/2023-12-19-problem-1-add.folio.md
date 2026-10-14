---
folio: "0.1"
id: "01HJ1YQN800HF6M1H4TR6T0TNN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00040235"
effective: "2023-12-19"
recorded: "2023-12-19T15:12:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes mellitus, onset 2022.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10244",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2022-01-01", "precision": "year" },
    "visit_id": "V-2023-121916"
  }
}
```
