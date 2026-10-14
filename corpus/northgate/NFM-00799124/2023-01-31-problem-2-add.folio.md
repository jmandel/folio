---
folio: "0.1"
id: "01GR4BW4W0BQKJ9NPG5D1KFREW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00799124"
effective: "2023-01-31"
recorded: "2023-01-31T10:52:00-06:00"
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
    "problem_id": "PL-15087",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2020-08-01", "precision": "month" },
    "visit_id": "V-2023-013185"
  }
}
```
