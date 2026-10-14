---
folio: "0.1"
id: "01H11ZPGJ0DD86NPF4HTEEZMFR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00968157"
effective: "2023-05-22"
recorded: "2023-05-22T10:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 DM, onset 2022 per pt. Added at first visit here.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11961",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2022-01-01", "precision": "year" },
    "visit_id": "V-2023-052265"
  }
}
```
