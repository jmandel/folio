---
folio: "0.1"
id: "01FRV84Q10A3W781ZR4Z99649G"
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
<ref id="prob_1">Primary OA of knee, onset 2018 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10313",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2018-01-01", "precision": "year" },
    "visit_id": "V-2022-010761"
  }
}
```
