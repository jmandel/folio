---
folio: "0.1"
id: "01GR4BW4W0SFZJ2AEZH7AXWCW6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00799124"
effective: "2023-01-31"
recorded: "2023-01-31T10:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">HTN since 2018, per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18405",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2018-01-01", "precision": "year" },
    "visit_id": "V-2023-013185"
  }
}
```
