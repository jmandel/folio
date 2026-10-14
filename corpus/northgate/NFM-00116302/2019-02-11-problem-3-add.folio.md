---
folio: "0.1"
id: "01D3F1JCS0EEZY9Z1GS5MCQZ5A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00116302"
effective: "2019-02-11"
recorded: "2019-02-11T13:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 1/2011 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19621",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "onset": { "date": "2011-01-15", "precision": "day" },
    "visit_id": "V-2019-021145"
  }
}
```
