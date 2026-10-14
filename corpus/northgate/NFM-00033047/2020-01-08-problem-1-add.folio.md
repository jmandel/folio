---
folio: "0.1"
id: "01DY36TZ805MZQ7S5QB9Z338TT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00033047"
effective: "2020-01-08"
recorded: "2020-01-08T12:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
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
    "problem_id": "PL-19637",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2017-01-01", "precision": "year" },
    "visit_id": "V-2020-010812"
  }
}
```
