---
folio: "0.1"
id: "01DNF94XP0TWRQZ11HWV1489K3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00927121"
effective: "2019-09-23"
recorded: "2019-09-23T09:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 2004.</ref> Hx per pt, added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9071",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "onset": { "date": "2004-01-01", "precision": "year" },
    "visit_id": "V-2019-092338"
  }
}
```
