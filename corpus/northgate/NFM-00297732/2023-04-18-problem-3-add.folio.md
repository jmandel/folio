---
folio: "0.1"
id: "01GYAYFXS00N0YPG06GFH79B9N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00297732"
effective: "2023-04-18"
recorded: "2023-04-18T14:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary osteoarthritis of knee.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15375",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2020-07-01", "precision": "month" },
    "visit_id": "V-2023-041841"
  }
}
```
