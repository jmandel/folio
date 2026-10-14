---
folio: "0.1"
id: "01DWD6S400T7608Q4DAVPNA0FR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00490995"
effective: "2019-12-18"
recorded: "2019-12-18T13:12:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes mellitus, onset 10/2007.</ref> History per pt, added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13163",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2007-10-01", "precision": "month" },
    "visit_id": "V-2019-121898"
  }
}
```
