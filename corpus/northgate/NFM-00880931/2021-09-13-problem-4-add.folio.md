---
folio: "0.1"
id: "01FFG60TB0MMZ9SYGSB3G6V747"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00880931"
effective: "2021-09-13"
recorded: "2021-09-13T13:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 3/2007 per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17599",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2007-03-01", "precision": "month" },
    "visit_id": "V-2021-091357"
  }
}
```
