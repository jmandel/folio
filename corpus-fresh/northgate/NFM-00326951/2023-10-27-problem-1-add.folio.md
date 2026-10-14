---
folio: "0.1"
id: "01HDS7N7406WM65BW6NR7CRHR3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00326951"
effective: "2023-10-27"
recorded: "2023-10-27T13:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes, onset 2015, per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10064",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2015-01-01", "precision": "year" },
    "visit_id": "V-2023-102775"
  }
}
```
