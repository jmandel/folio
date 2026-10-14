---
folio: "0.1"
id: "01DWWTKCD0HX68RWSR8SY9N5EM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00665649"
effective: "2019-12-24"
recorded: "2019-12-24T14:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
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
    "problem_id": "PL-12982",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2016-01-01", "precision": "year" },
    "visit_id": "V-2019-122431"
  }
}
```
