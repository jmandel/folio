---
folio: "0.1"
id: "01D6TTH720PH0W708R85AKTP9N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00821220"
effective: "2019-03-25"
recorded: "2019-03-25T11:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 2005 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16128",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "onset": { "date": "2005-02-04", "precision": "day" },
    "visit_id": "V-2019-032586"
  }
}
```
