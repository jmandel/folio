---
folio: "0.1"
id: "01DX1NYPE0G8DE6P1C40G1ZQFW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00937505"
effective: "2019-12-26"
recorded: "2019-12-26T12:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Knee OA, onset 2017 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14020",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "onset": { "date": "2017-01-01", "precision": "year" },
    "visit_id": "V-2019-122672"
  }
}
```
