---
folio: "0.1"
id: "01DXYBRT60TM515RNNWN9ANHYE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00140287"
effective: "2020-01-06"
recorded: "2020-01-06T15:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 12/2018 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11658",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2018-12-27", "precision": "day" },
    "visit_id": "V-2020-010675"
  }
}
```
