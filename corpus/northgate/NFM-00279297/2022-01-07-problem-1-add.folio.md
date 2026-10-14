---
folio: "0.1"
id: "01FRV84Q105TZCC2QZQM0R1XZB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00279297"
effective: "2022-01-07"
recorded: "2022-01-07T15:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
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
    "problem_id": "PL-19579",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2008-01-01", "precision": "year" },
    "visit_id": "V-2022-010761"
  }
}
```
