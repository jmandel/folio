---
folio: "0.1"
id: "01GFRJHCW0CNMV0TFXQJ5RE58S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00977838"
effective: "2022-10-19"
recorded: "2022-10-19T11:52:00-05:00"
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
    "problem_id": "PL-19846",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2019-01-01", "precision": "year" },
    "visit_id": "V-2022-101911"
  }
}
```
