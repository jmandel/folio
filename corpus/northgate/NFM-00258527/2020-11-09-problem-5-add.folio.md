---
folio: "0.1"
id: "01EPPRECJ0584D30ME7XEEZJ5J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00258527"
effective: "2020-11-09"
recorded: "2020-11-09T09:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
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
    "problem_id": "PL-18036",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2017-10-12", "precision": "day" },
    "visit_id": "V-2020-110972"
  }
}
```
