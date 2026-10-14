---
folio: "0.1"
id: "01E352Q6F0Y3DV0HE9VDYMAP6W"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00257732"
effective: "2020-03-11"
recorded: "2020-03-11T10:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 2008. History per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18198",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2008-01-01", "precision": "year" },
    "visit_id": "V-2020-031193"
  }
}
```
