---
folio: "0.1"
id: "01DW86J5G0T8E0TJWPRYWHSQN5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00900818"
effective: "2019-12-16"
recorded: "2019-12-16T14:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2007 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17919",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "onset": { "date": "2007-01-01", "precision": "year" },
    "visit_id": "V-2019-121612"
  }
}
```
