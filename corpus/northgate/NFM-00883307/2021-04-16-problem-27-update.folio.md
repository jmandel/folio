---
folio: "0.1"
id: "01F3E95HQGGHF4N5NK6CF1B0SW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00883307"
effective: "2021-04-16"
recorded: "2021-04-16T16:25:10-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Chronic kidney disease stage 3b.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19344",
    "action": "update",
    "description": "Chronic kidney disease stage 3b",
    "icd10cm": "N18.32",
    "snomed": "700378005",
    "onset": { "date": "2020-08-04", "precision": "day" }
  }
}
```
