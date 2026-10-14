---
folio: "0.1"
id: "01GW2M6XJ0JHJZW40402W97W6S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00455898"
effective: "2023-03-21"
recorded: "2023-03-21T12:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 2022 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17009",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2022-01-01", "precision": "year" },
    "visit_id": "V-2023-032174"
  }
}
```
