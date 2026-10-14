---
folio: "0.1"
id: "01D1C9T920NNRE6F52JMT0DQYK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00641111"
effective: "2019-01-16"
recorded: "2019-01-16T15:42:00-06:00"
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
    "problem_id": "PL-16991",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "onset": { "date": "2011-01-01", "precision": "year" },
    "visit_id": "V-2019-011654"
  }
}
```
