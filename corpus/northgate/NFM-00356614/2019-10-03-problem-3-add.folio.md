---
folio: "0.1"
id: "01DP9FDW407SJM2MK1R0BJ0GWK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00356614"
effective: "2019-10-03"
recorded: "2019-10-03T13:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19074",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "onset": { "date": "2009-08-01", "precision": "month" },
    "visit_id": "V-2019-100347"
  }
}
```
