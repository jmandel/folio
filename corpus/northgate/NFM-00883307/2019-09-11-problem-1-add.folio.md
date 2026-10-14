---
folio: "0.1"
id: "01DMGNH8P0CF7FA3FZB1DKKFDH"
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
<ref id="prob_1">Essential hypertension.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16651",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "onset": { "date": "2015-01-01", "precision": "year" },
    "visit_id": "V-2019-091115"
  }
}
```
