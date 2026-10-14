---
folio: "0.1"
id: "01GTYGBKT0QAY4RMGQP685CK8J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00808670"
effective: "2023-03-07"
recorded: "2023-03-07T11:02:00-06:00"
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
    "problem_id": "PL-10969",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2009-01-01", "precision": "year" },
    "visit_id": "V-2023-030795"
  }
}
```
