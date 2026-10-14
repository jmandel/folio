---
folio: "0.1"
id: "01FRV84Q10NAVZS6CGQNGQQW37"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00581886"
effective: "2022-01-07"
recorded: "2022-01-07T15:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary osteoarthritis of knee added, onset 2020.</ref> History per pt.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16606",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2020-01-01", "precision": "year" },
    "visit_id": "V-2022-010716"
  }
}
```
