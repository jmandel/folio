---
folio: "0.1"
id: "01ET5W44602DEGC8VGJQVWTHEZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00616779"
effective: "2020-12-22"
recorded: "2020-12-22T12:42:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential HTN, onset 2/2007 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17555",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2007-02-01", "precision": "month" },
    "visit_id": "V-2020-122263"
  }
}
```
