---
folio: "0.1"
id: "01E5X1NY00J8GASEHZWCV2BQRD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00621637"
effective: "2020-04-14"
recorded: "2020-04-14T14:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 11/2016.</ref> Added at first visit, hx per pt.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15615",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2016-11-21", "precision": "day" },
    "restricted": "BH",
    "visit_id": "V-2020-041457"
  }
}
```
