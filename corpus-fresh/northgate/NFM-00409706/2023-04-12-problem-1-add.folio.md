---
folio: "0.1"
id: "01GXTYY9N0P1YFYYG21NNJ0KQW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00409706"
effective: "2023-04-12"
recorded: "2023-04-12T09:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential HTN, onset 2021 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16090",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2021-01-01", "precision": "year" },
    "visit_id": "V-2023-041298"
  }
}
```
