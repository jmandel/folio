---
folio: "0.1"
id: "01JH1DYBBGSAXZ7X5XZRGVS5EH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00673395"
effective: "2025-01-07"
recorded: "2025-01-07T16:25:10-06:00"
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
    "problem_id": "PL-14175",
    "action": "update",
    "description": "Chronic kidney disease stage 3b",
    "icd10cm": "N18.32",
    "snomed": "700378005",
    "onset": { "date": "2020-04-27", "precision": "day" }
  }
}
```
