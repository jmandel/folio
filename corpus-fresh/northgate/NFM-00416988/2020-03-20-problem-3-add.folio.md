---
folio: "0.1"
id: "01E3W2VQ20PFN7D6P1J0HDW19Z"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00416988"
effective: "2020-03-20"
recorded: "2020-03-20T08:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 2014 per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17235",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2014-05-08", "precision": "day" },
    "visit_id": "V-2020-032095"
  }
}
```
