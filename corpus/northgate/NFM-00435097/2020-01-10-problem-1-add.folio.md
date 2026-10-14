---
folio: "0.1"
id: "01DY8GS6P0XC06YVEXTF8KV6WM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00435097"
effective: "2020-01-10"
recorded: "2020-01-10T14:02:00-06:00"
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
    "problem_id": "PL-12102",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2008-10-01", "precision": "month" },
    "visit_id": "V-2020-011099"
  }
}
```
