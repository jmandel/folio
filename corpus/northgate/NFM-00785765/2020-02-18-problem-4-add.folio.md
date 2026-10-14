---
folio: "0.1"
id: "01E1CC8EN0EV75R568NNSJKFHN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785765"
effective: "2020-02-18"
recorded: "2020-02-18T08:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 2011.</ref> Hx per pt, added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16562",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2011-01-01", "precision": "year" },
    "visit_id": "V-2020-021894"
  }
}
```
