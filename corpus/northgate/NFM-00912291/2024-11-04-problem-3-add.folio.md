---
folio: "0.1"
id: "01JBWMAHT04G54EVFWWYH1AP0C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00912291"
effective: "2024-11-04"
recorded: "2024-11-04T16:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 10/2011 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14264",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2011-10-01", "precision": "month" },
    "visit_id": "V-2024-110496"
  }
}
```
