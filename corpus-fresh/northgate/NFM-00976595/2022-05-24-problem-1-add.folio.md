---
folio: "0.1"
id: "01G3VP9K50Y4XCZ0SJ5PS5RRWH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00976595"
effective: "2022-05-24"
recorded: "2022-05-24T13:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2019 per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15947",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2019-01-01", "precision": "year" },
    "visit_id": "V-2022-052477"
  }
}
```
