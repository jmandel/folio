---
folio: "0.1"
id: "01J33VJB60CB40VJEMA8B7V5GT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00945734"
effective: "2024-07-18"
recorded: "2024-07-18T16:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 1/2017.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17168",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2017-01-08", "precision": "day" },
    "visit_id": "V-2024-071867"
  }
}
```
