---
folio: "0.1"
id: "01G5SMZMK0YE0G32AMACM8K4YD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00349670"
effective: "2022-06-17"
recorded: "2022-06-17T15:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2009.</ref> History per pt, added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18898",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2009-06-23", "precision": "day" },
    "visit_id": "V-2022-061785"
  }
}
```
