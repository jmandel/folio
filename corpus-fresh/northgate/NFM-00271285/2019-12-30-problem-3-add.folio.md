---
folio: "0.1"
id: "01DXBMCGN0Z1RWNFCFCPJJPV5D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00271285"
effective: "2019-12-30"
recorded: "2019-12-30T08:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 6/2017 per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16313",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "onset": { "date": "2017-06-11", "precision": "day" },
    "visit_id": "V-2019-123015"
  }
}
```
