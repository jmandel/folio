---
folio: "0.1"
id: "01GT9YAFP07ZBW94SMHQ88586X"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00164285"
effective: "2023-02-27"
recorded: "2023-02-27T11:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes, onset 10/2014 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16831",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2014-10-14", "precision": "day" },
    "visit_id": "V-2023-022729"
  }
}
```
