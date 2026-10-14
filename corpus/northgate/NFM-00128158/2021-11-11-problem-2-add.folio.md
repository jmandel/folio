---
folio: "0.1"
id: "01FM801BQ04B9APSBSHKZ6KSZC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00128158"
effective: "2021-11-11"
recorded: "2021-11-11T11:17:00-06:00"
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
    "problem_id": "PL-12362",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2013-01-01", "precision": "year" },
    "visit_id": "V-2021-111119"
  }
}
```
