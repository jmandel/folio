---
folio: "0.1"
id: "01GASCRX80VGP8J0NH1ZC36T0N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00472987"
effective: "2022-08-18"
recorded: "2022-08-18T16:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 DM, onset 6/2016 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13565",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2016-06-25", "precision": "day" },
    "visit_id": "V-2022-081839"
  }
}
```
