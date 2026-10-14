---
folio: "0.1"
id: "01GSE53WT0C4CC0HX4FPKYWP0A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00634174"
effective: "2023-02-16"
recorded: "2023-02-16T16:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 DM, dx 2019 per pt. Added at first visit.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14989",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2019-01-01", "precision": "year" },
    "visit_id": "V-2023-021617"
  }
}
```
