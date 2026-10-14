---
folio: "0.1"
id: "01EPCXEDZ0WWT4VQJ849DETVCA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00337133"
effective: "2020-11-05"
recorded: "2020-11-05T13:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes, onset 2019 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10088",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2019-01-01", "precision": "year" },
    "visit_id": "V-2020-110515"
  }
}
```
