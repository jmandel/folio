---
folio: "0.1"
id: "01ESV5C3M0M4CYFJE2ZCAKRQCT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00625829"
effective: "2020-12-18"
recorded: "2020-12-18T08:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes dx 9/2012, per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16948",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2012-09-01", "precision": "month" },
    "visit_id": "V-2020-121858"
  }
}
```
