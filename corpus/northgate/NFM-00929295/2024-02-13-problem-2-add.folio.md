---
folio: "0.1"
id: "01HPHZ8SW0DW4DSTX25GR407AF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00929295"
effective: "2024-02-13"
recorded: "2024-02-13T13:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">DM2 since 2020 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17158",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2020-01-01", "precision": "year" },
    "visit_id": "V-2024-021372"
  }
}
```
