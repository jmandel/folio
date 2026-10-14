---
folio: "0.1"
id: "01E6YBZMH0P5E7Y0W8AB879T0B"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00717420"
effective: "2020-04-27"
recorded: "2020-04-27T12:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary OA of knee, onset 2013 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11412",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2013-01-01", "precision": "year" },
    "visit_id": "V-2020-042724"
  }
}
```
