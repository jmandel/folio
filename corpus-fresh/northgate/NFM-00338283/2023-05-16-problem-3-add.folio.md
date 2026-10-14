---
folio: "0.1"
id: "01H0K6RV700BF27N4P9JDSBVME"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00338283"
effective: "2023-05-16"
recorded: "2023-05-16T16:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 10/5/2020.</ref> History per pt, added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10604",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2020-10-05", "precision": "day" },
    "visit_id": "V-2023-051659"
  }
}
```
