---
folio: "0.1"
id: "01EC32V7T0ERCK750DXE89CTBE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00284303"
effective: "2020-06-30"
recorded: "2020-06-30T12:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 2009.</ref> Hx per pt, added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16948",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2009-01-01", "precision": "year" },
    "visit_id": "V-2020-063044"
  }
}
```
