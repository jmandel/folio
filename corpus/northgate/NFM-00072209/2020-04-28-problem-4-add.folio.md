---
folio: "0.1"
id: "01E70FSE4034GBTQN6MMM053ZW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00072209"
effective: "2020-04-28"
recorded: "2020-04-28T08:32:00-05:00"
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
    "problem_id": "PL-10435",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2015-08-01", "precision": "month" },
    "visit_id": "V-2020-042866"
  }
}
```
