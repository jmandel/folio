---
folio: "0.1"
id: "01D8745K70ERDZGHV4DYP9MZ90"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00980170"
effective: "2019-04-11"
recorded: "2019-04-11T16:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 7/2005.</ref> Hx per pt at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18571",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "onset": { "date": "2005-07-01", "precision": "month" },
    "visit_id": "V-2019-041118"
  }
}
```
