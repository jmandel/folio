---
folio: "0.1"
id: "01J748JCC0070QKBA7A95FQVQ3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00945449"
effective: "2024-09-06"
recorded: "2024-09-06T13:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 10/2013 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10115",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2013-10-01", "precision": "month" },
    "visit_id": "V-2024-090698"
  }
}
```
