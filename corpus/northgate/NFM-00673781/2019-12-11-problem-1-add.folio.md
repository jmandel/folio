---
folio: "0.1"
id: "01DVV805S06QAEP1TPDDHEB3RQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00673781"
effective: "2019-12-11"
recorded: "2019-12-11T13:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential HTN, onset 2013, per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17827",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "onset": { "date": "2013-01-01", "precision": "year" },
    "visit_id": "V-2019-121132"
  }
}
```
