---
folio: "0.1"
id: "01J1FJE9Y0XGD7900RTV9BHHRY"
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
<ref id="prob_1">Hyperlipidemia.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14263",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2017-06-06", "precision": "day" },
    "visit_id": "V-2024-062831"
  }
}
```
