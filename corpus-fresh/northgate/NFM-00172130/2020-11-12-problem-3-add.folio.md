---
folio: "0.1"
id: "01EPYQBQQ05S8BV1AT3W0GCGGC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00172130"
effective: "2020-11-12"
recorded: "2020-11-12T11:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 7/2010 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17872",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2010-07-01", "precision": "month" },
    "visit_id": "V-2020-111269"
  }
}
```
