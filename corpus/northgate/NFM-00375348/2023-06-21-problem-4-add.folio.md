---
folio: "0.1"
id: "01H3FSBPM07P4SHTJM34EP7HVD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00375348"
effective: "2023-06-21"
recorded: "2023-06-21T15:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity since 2010 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12782",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2010-01-01", "precision": "year" },
    "visit_id": "V-2023-062188"
  }
}
```
