---
folio: "0.1"
id: "01DRYRJ110V8YF66AKDBHNV1HR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00382868"
effective: "2019-11-05"
recorded: "2019-11-05T15:47:00-06:00"
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
    "problem_id": "PL-9296",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "onset": { "date": "2014-01-01", "precision": "year" },
    "visit_id": "V-2019-110587"
  }
}
```
