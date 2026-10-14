---
folio: "0.1"
id: "01J1ZR06D00JDJXT5AP13XSXF1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00187523"
effective: "2024-07-04"
recorded: "2024-07-04T15:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
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
    "problem_id": "PL-15428",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2016-12-28", "precision": "day" },
    "visit_id": "V-2024-070484"
  }
}
```
