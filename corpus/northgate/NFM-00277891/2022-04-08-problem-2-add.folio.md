---
folio: "0.1"
id: "01G056JRA0PHFB2X44ZPY1FQDX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00277891"
effective: "2022-04-08"
recorded: "2022-04-08T13:22:00-05:00"
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
    "problem_id": "PL-19448",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2014-07-01", "precision": "month" },
    "visit_id": "V-2022-040883"
  }
}
```
