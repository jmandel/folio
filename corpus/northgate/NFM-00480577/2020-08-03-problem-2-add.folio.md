---
folio: "0.1"
id: "01EETJMR000VECW7A67EE1Z4M0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00480577"
effective: "2020-08-03"
recorded: "2020-08-03T11:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes, onset 4/2016 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12626",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2016-04-01", "precision": "month" },
    "visit_id": "V-2020-080335"
  }
}
```
