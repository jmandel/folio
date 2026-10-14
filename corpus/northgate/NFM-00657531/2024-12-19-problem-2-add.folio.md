---
folio: "0.1"
id: "01JFG7B2S0Y3RYBV7V6WJBEB0R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00657531"
effective: "2024-12-19"
recorded: "2024-12-19T13:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">DM2, onset 11/2023 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9343",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2023-11-20", "precision": "day" },
    "visit_id": "V-2024-121996"
  }
}
```
