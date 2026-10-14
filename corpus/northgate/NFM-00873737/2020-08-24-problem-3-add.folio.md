---
folio: "0.1"
id: "01EGGVVJ80C5M0G174850NYR40"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00873737"
effective: "2020-08-24"
recorded: "2020-08-24T13:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hypothyroidism.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12257",
    "action": "add",
    "description": "Hypothyroidism",
    "icd10cm": "E03.9",
    "snomed": "40930008",
    "onset": { "date": "2007-01-01", "precision": "year" },
    "visit_id": "V-2020-082472"
  }
}
```
