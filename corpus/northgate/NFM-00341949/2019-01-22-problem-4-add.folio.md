---
folio: "0.1"
id: "01D1V25MF0AA5TWJXKY4DT5YAV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00341949"
effective: "2019-01-22"
recorded: "2019-01-22T09:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14933",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "onset": { "date": "2011-08-01", "precision": "month" },
    "visit_id": "V-2019-012224"
  }
}
```
