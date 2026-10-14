---
folio: "0.1"
id: "01ECB4X9M0TS11PVWY452Z6K1Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00212854"
effective: "2020-07-03"
recorded: "2020-07-03T15:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2018.</ref> Hx per pt, added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13887",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2018-01-01", "precision": "year" },
    "visit_id": "V-2020-070345"
  }
}
```
