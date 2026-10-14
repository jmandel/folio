---
folio: "0.1"
id: "01GKAEX8T0SFSESD50RJAPN0YF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00454123"
effective: "2022-12-02"
recorded: "2022-12-02T16:22:00-06:00"
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
    "problem_id": "PL-16795",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2018-11-01", "precision": "month" },
    "visit_id": "V-2022-120243"
  }
}
```
