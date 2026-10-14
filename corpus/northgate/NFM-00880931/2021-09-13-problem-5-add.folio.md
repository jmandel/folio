---
folio: "0.1"
id: "01FFG60TB01Q7YC3V5HSASN00A"
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
<ref id="prob_1">Primary osteoarthritis of knee.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10387",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2016-01-01", "precision": "year" },
    "visit_id": "V-2021-091357"
  }
}
```
