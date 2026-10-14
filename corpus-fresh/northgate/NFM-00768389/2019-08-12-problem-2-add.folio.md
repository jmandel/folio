---
folio: "0.1"
id: "01DJ385R90R87WR0KCF2ES94WW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00768389"
effective: "2019-08-12"
recorded: "2019-08-12T10:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes, dx 2014 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10407",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2014-01-01", "precision": "year" },
    "visit_id": "V-2019-081246"
  }
}
```
