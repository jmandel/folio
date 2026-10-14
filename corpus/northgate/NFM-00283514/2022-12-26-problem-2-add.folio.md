---
folio: "0.1"
id: "01GN7NJ8W0G7H79PBHG1NVVXQ3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00283514"
effective: "2022-12-26"
recorded: "2022-12-26T10:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 8/2018.</ref> Added at first visit, hx per pt.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16249",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2018-08-01", "precision": "month" },
    "visit_id": "V-2022-122663"
  }
}
```
