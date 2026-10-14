---
folio: "0.1"
id: "01E7GG6H50052PTMTVR027AFB1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00254529"
effective: "2020-05-04"
recorded: "2020-05-04T13:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">DM2, onset ~1/2014.</ref> Added at first visit here, hx per pt.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12473",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2014-01-01", "precision": "month" },
    "visit_id": "V-2020-050485"
  }
}
```
