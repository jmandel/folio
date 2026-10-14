---
folio: "0.1"
id: "01DMGNH8P0B51S0DPCBEC4TEJW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00883307"
effective: "2019-09-11"
recorded: "2019-09-11T12:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes mellitus, onset 2016 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19540",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2016-01-01", "precision": "year" },
    "visit_id": "V-2019-091115"
  }
}
```
