---
folio: "0.1"
id: "01GR4BW4W0YRDT6Z4SSMV0YRRJ"
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
<ref id="prob_1">HFrEF since 2021, per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9318",
    "action": "add",
    "description": "Heart failure with reduced ejection fraction",
    "icd10cm": "I50.22",
    "snomed": "703272007",
    "onset": { "date": "2021-01-01", "precision": "year" },
    "visit_id": "V-2023-013185"
  }
}
```
