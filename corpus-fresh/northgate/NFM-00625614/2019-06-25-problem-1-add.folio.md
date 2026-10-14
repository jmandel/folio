---
folio: "0.1"
id: "01DE7PH140V8WFQN0B1MG6C07P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00625614"
effective: "2019-06-25"
recorded: "2019-06-25T11:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential HTN, onset 2011, per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9257",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "onset": { "date": "2011-01-01", "precision": "year" },
    "visit_id": "V-2019-062549"
  }
}
```
