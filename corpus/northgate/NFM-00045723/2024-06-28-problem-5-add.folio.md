---
folio: "0.1"
id: "01J1FJE9Y0911YAMZMMVW34HFS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00045723"
effective: "2024-06-28"
recorded: "2024-06-28T09:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hypothyroidism.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18401",
    "action": "add",
    "description": "Hypothyroidism",
    "icd10cm": "E03.9",
    "snomed": "40930008",
    "onset": { "date": "2018-01-01", "precision": "year" },
    "visit_id": "V-2024-062831"
  }
}
```
