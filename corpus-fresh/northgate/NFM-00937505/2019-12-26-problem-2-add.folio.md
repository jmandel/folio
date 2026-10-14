---
folio: "0.1"
id: "01DX1NYPE0PJPXMB888ZJ57W5E"
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
<ref id="prob_1">Hyperlipidemia since 12/2012 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10013",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "onset": { "date": "2012-12-01", "precision": "month" },
    "visit_id": "V-2019-122672"
  }
}
```
