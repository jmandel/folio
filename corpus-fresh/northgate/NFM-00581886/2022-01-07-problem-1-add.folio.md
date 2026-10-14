---
folio: "0.1"
id: "01FRV84Q10WTET6DJ1ZX7P8BZB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00581886"
effective: "2022-01-07"
recorded: "2022-01-07T15:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension added, onset 2016.</ref> History per pt.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12349",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2016-01-01", "precision": "year" },
    "visit_id": "V-2022-010716"
  }
}
```
