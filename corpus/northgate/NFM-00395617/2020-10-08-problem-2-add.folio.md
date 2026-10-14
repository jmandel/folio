---
folio: "0.1"
id: "01EM47Q700GK9NQR13VKK9WPX4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00395617"
effective: "2020-10-08"
recorded: "2020-10-08T08:52:00-05:00"
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
    "problem_id": "PL-18280",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2013-12-01", "precision": "month" },
    "visit_id": "V-2020-100848"
  }
}
```
