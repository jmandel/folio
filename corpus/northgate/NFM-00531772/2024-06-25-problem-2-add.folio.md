---
folio: "0.1"
id: "01J17ZHFF0C7R8EH0688G6F3R5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00531772"
effective: "2024-06-25"
recorded: "2024-06-25T10:17:00-05:00"
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
    "problem_id": "PL-14478",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2020-10-01", "precision": "month" },
    "visit_id": "V-2024-062579"
  }
}
```
