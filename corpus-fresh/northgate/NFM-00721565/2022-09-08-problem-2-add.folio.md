---
folio: "0.1"
id: "01GCEW7RA03SVJVYZSVE4FKV5S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00721565"
effective: "2022-09-08"
recorded: "2022-09-08T10:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">DM2, onset ~12/2019 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11168",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2019-12-14", "precision": "day" },
    "visit_id": "V-2022-090872"
  }
}
```
