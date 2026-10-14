---
folio: "0.1"
id: "01D59RD2J0E9HN01W6P82FR09V"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00493571"
effective: "2019-03-06"
recorded: "2019-03-06T09:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 2/2009.</ref> Hx per pt, first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18058",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "onset": { "date": "2009-02-03", "precision": "day" },
    "visit_id": "V-2019-030683"
  }
}
```
