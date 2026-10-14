---
folio: "0.1"
id: "01ERYV06M0K9N6PQ9SQPWT3F99"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00076765"
effective: "2020-12-07"
recorded: "2020-12-07T08:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 3/2014 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16248",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2014-03-01", "precision": "month" },
    "visit_id": "V-2020-120789"
  }
}
```
