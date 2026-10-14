---
folio: "0.1"
id: "01DB32QJT0M8JHBSG8A68WNBJ7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00853558"
effective: "2019-05-17"
recorded: "2019-05-17T09:22:00-05:00"
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
    "problem_id": "PL-10777",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2017-01-01", "precision": "year" },
    "visit_id": "V-2019-051745"
  }
}
```
