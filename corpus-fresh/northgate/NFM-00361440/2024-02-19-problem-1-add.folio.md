---
folio: "0.1"
id: "01HQ1PT2W0JS7GHSK0KHH5W195"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00361440"
effective: "2024-02-19"
recorded: "2024-02-19T16:12:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2013.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18332",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2013-01-01", "precision": "year" },
    "visit_id": "V-2024-021912"
  }
}
```
