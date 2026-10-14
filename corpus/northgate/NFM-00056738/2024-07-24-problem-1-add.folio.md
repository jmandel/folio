---
folio: "0.1"
id: "01J3JF2240AK5H54R4CQVCSDZT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00056738"
effective: "2024-07-24"
recorded: "2024-07-24T08:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
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
    "problem_id": "PL-17100",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2019-01-01", "precision": "year" },
    "visit_id": "V-2024-072447"
  }
}
```
