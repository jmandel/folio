---
folio: "0.1"
id: "01EM47Q7000W2VZ6R6GHA61MT0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00395617"
effective: "2020-10-08"
recorded: "2020-10-08T08:52:00-05:00"
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
    "problem_id": "PL-12365",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2007-05-01", "precision": "month" },
    "visit_id": "V-2020-100848"
  }
}
```
