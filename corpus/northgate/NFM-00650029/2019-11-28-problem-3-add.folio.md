---
folio: "0.1"
id: "01DTSRHNT03P1P7FB3GR28P5DK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00650029"
effective: "2019-11-28"
recorded: "2019-11-28T13:42:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity since 2006 per pt. Added to problem list at first visit here.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15133",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "onset": { "date": "2006-01-01", "precision": "year" },
    "visit_id": "V-2019-112831"
  }
}
```
