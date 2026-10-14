---
folio: "0.1"
id: "01DMXKT3E02R0BKNTJGQX4MJNT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00045785"
effective: "2019-09-16"
recorded: "2019-09-16T13:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes mellitus.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13468",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2015-06-01", "precision": "month" },
    "visit_id": "V-2019-091627"
  }
}
```
