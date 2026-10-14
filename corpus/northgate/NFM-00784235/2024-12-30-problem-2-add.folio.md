---
folio: "0.1"
id: "01JGC5ZM20YKSW5WYRAA9CY3NA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00784235"
effective: "2024-12-30"
recorded: "2024-12-30T10:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes mellitus.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11541",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2019-10-21", "precision": "day" },
    "visit_id": "V-2024-123025"
  }
}
```
