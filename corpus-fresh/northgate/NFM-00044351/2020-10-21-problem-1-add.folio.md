---
folio: "0.1"
id: "01EN6FFXA0WENB7WD6VS94NNQN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00044351"
effective: "2020-10-21"
recorded: "2020-10-21T16:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 11/2008.</ref> Hx per pt, added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16355",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2008-11-01", "precision": "month" },
    "visit_id": "V-2020-102192"
  }
}
```
