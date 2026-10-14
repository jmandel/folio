---
folio: "0.1"
id: "01D88X3G00QB2ZR7H7X49SV5JW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00363203"
effective: "2019-04-12"
recorded: "2019-04-12T08:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes, onset 12/2007.</ref> Hx per pt, added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11040",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2007-12-20", "precision": "day" },
    "visit_id": "V-2019-041226"
  }
}
```
