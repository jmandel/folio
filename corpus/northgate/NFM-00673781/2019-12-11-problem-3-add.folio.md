---
folio: "0.1"
id: "01DVV805S0NDPQ7SS6XK1WV62X"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00673781"
effective: "2019-12-11"
recorded: "2019-12-11T13:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 2017, per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9165",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "onset": { "date": "2017-01-01", "precision": "year" },
    "visit_id": "V-2019-121132"
  }
}
```
