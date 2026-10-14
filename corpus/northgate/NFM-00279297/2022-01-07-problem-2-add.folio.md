---
folio: "0.1"
id: "01FRV84Q106ZBCWQ2F9Z81RJRA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00279297"
effective: "2022-01-07"
recorded: "2022-01-07T15:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 10/2014 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14489",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2014-10-27", "precision": "day" },
    "visit_id": "V-2022-010761"
  }
}
```
