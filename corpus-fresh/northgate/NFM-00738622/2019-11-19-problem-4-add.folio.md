---
folio: "0.1"
id: "01DT2JZ6T0FQHT6AY9MVBX2RR8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00738622"
effective: "2019-11-19"
recorded: "2019-11-19T13:42:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary OA of knee, onset 2016 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19807",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "onset": { "date": "2016-01-01", "precision": "year" },
    "visit_id": "V-2019-111963"
  }
}
```
