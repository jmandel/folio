---
folio: "0.1"
id: "01J3FYC8Y06YK3GQMBQQH6QCR0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00493884"
effective: "2024-07-23"
recorded: "2024-07-23T09:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 2019.</ref> Hx per pt, added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19435",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2019-01-01", "precision": "year" },
    "visit_id": "V-2024-072368"
  }
}
```
