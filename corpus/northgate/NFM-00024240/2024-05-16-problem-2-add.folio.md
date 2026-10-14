---
folio: "0.1"
id: "01HY0T6S203Q9BVA7GCK0WPA1K"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00024240"
effective: "2024-05-16"
recorded: "2024-05-16T08:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 7/2016 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18143",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2016-07-01", "precision": "month" },
    "visit_id": "V-2024-051696"
  }
}
```
