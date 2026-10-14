---
folio: "0.1"
id: "01HJ9MG1D03XP80YVADJY0Z25A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00830533"
effective: "2023-12-22"
recorded: "2023-12-22T14:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
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
    "problem_id": "PL-12251",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2014-01-01", "precision": "year" },
    "visit_id": "V-2023-122295"
  }
}
```
