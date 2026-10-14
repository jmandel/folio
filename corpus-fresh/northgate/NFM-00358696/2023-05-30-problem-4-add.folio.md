---
folio: "0.1"
id: "01H1PTWKP01P1XANF2VBC6QA43"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00358696"
effective: "2023-05-30"
recorded: "2023-05-30T12:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary osteoarthritis of knee, onset 6/2017 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15027",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2017-06-01", "precision": "month" },
    "visit_id": "V-2023-053041"
  }
}
```
