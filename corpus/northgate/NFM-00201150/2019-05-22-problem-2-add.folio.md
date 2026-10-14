---
folio: "0.1"
id: "01DBFVVM405Z72KNRRWK781FV0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00201150"
effective: "2019-05-22"
recorded: "2019-05-22T08:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes mellitus, onset 2017 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15508",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2017-01-01", "precision": "year" },
    "visit_id": "V-2019-052212"
  }
}
```
