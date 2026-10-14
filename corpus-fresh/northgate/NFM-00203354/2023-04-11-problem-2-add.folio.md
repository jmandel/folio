---
folio: "0.1"
id: "01GXRBP3R08XP5T9DCX9T0HT2X"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00203354"
effective: "2023-04-11"
recorded: "2023-04-11T09:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">DM2, dx 9/2019.</ref> Hx per pt, added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17485",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2019-09-01", "precision": "month" },
    "visit_id": "V-2023-041189"
  }
}
```
