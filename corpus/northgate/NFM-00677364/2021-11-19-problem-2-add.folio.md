---
folio: "0.1"
id: "01FMX033A0919DQAA2H8MBQGM8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00677364"
effective: "2021-11-19"
recorded: "2021-11-19T15:02:00-06:00"
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
    "problem_id": "PL-18441",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2019-05-09", "precision": "day" },
    "visit_id": "V-2021-111975"
  }
}
```
