---
folio: "0.1"
id: "01DTMAK8T0FR84F4MPA53YC902"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00377621"
effective: "2019-11-26"
recorded: "2019-11-26T11:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11786",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "onset": { "date": "2017-01-01", "precision": "year" },
    "visit_id": "V-2019-112613"
  }
}
```
