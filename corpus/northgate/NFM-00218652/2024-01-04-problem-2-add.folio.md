---
folio: "0.1"
id: "01HKAV2QB03JBKZ28E3A4PD2AN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00218652"
effective: "2024-01-04"
recorded: "2024-01-04T12:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">DM2, onset 3/2019 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10010",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2019-03-06", "precision": "day" },
    "visit_id": "V-2024-010465"
  }
}
```
