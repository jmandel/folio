---
folio: "0.1"
id: "01DBB5N3H0H2P4ZY9PSX1ZDNHC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00821886"
effective: "2019-05-20"
recorded: "2019-05-20T12:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2005 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18292",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "onset": { "date": "2005-01-01", "precision": "year" },
    "visit_id": "V-2019-052048"
  }
}
```
