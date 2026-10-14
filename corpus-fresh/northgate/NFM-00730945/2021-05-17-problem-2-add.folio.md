---
folio: "0.1"
id: "01F5XKVMW071NQ2VCEQ30RHSWC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00730945"
effective: "2021-05-17"
recorded: "2021-05-17T11:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">DM2, onset 1/2016 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11542",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2016-01-01", "precision": "month" },
    "visit_id": "V-2021-051789"
  }
}
```
