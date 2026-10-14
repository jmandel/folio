---
folio: "0.1"
id: "01DTSY8S60EPGQBMRVZ8R10Q7Z"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00084740"
effective: "2019-11-28"
recorded: "2019-11-28T15:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes, onset 2007.</ref> Added at first visit, history per pt.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19658",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2007-01-01", "precision": "year" },
    "visit_id": "V-2019-112847"
  }
}
```
