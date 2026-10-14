---
folio: "0.1"
id: "01DNF94XP029PTTV6E6WHVWZNH"
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
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 4/2017.</ref> Hx per pt, added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18493",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "onset": { "date": "2017-04-19", "precision": "day" },
    "restricted": "BH",
    "visit_id": "V-2019-092338"
  }
}
```
