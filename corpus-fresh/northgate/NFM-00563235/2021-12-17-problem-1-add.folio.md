---
folio: "0.1"
id: "01FQ56N2Y09CJ7NK7Y6W9VYQZE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00563235"
effective: "2021-12-17"
recorded: "2021-12-17T16:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential HTN, onset 2015 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16413",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2015-01-01", "precision": "year" },
    "visit_id": "V-2021-121798"
  }
}
```
