---
folio: "0.1"
id: "01ECWMH0G0JE689MXGAHD6935C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00994489"
effective: "2020-07-10"
recorded: "2020-07-10T10:12:00-05:00"
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
    "problem_id": "PL-14943",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2007-07-26", "precision": "day" },
    "visit_id": "V-2020-071091"
  }
}
```
