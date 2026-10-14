---
folio: "0.1"
id: "01ED7H99D0E06C6MXS2F4012RP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00670731"
effective: "2020-07-14"
recorded: "2020-07-14T15:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes mellitus, dx 5/2009 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15695",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2009-05-01", "precision": "month" },
    "visit_id": "V-2020-071424"
  }
}
```
