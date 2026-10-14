---
folio: "0.1"
id: "01HRQGVNS0EP5HANVCSBBG08H5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00818691"
effective: "2024-03-11"
recorded: "2024-03-11T14:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11856",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2019-01-01", "precision": "year" },
    "visit_id": "V-2024-031123"
  }
}
```
