---
folio: "0.1"
id: "01DDXKSWC0AZX9BHKQ5E4MSMKP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00767475"
effective: "2019-06-21"
recorded: "2019-06-21T13:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2010.</ref> Hx per pt, added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15344",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "onset": { "date": "2010-01-01", "precision": "year" },
    "visit_id": "V-2019-062176"
  }
}
```
