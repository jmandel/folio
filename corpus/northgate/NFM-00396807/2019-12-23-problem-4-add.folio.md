---
folio: "0.1"
id: "01DWSNADF0K1EHJ6Z9SJ8P4TF6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00396807"
effective: "2019-12-23"
recorded: "2019-12-23T09:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16673",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "onset": { "date": "2017-08-01", "precision": "month" },
    "visit_id": "V-2019-122355"
  }
}
```
