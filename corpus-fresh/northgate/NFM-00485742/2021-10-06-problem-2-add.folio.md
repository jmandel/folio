---
folio: "0.1"
id: "01FHBEK4609TS1Z60GY79RT3HQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00485742"
effective: "2021-10-06"
recorded: "2021-10-06T13:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">DM2, onset 5/2011 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10988",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2011-05-01", "precision": "month" },
    "visit_id": "V-2021-100637"
  }
}
```
