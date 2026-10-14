---
folio: "0.1"
id: "01J6ANQZT0WYWSRRYWQWCZFGRQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00373604"
effective: "2024-08-27"
recorded: "2024-08-27T14:42:00-05:00"
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
    "problem_id": "PL-19092",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2022-01-01", "precision": "year" },
    "visit_id": "V-2024-082741"
  }
}
```
