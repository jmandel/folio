---
folio: "0.1"
id: "01D3F1JCS0D6A2YJPTFM2FBHSS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00116302"
effective: "2019-02-11"
recorded: "2019-02-11T13:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes, onset 2/2018 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9096",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2018-02-20", "precision": "day" },
    "visit_id": "V-2019-021145"
  }
}
```
