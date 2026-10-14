---
folio: "0.1"
id: "01JPNJASQGGPQ4SEPJSHBTJC9V"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00735634"
effective: "2025-03-18"
recorded: "2025-03-18T16:25:10-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Chronic kidney disease stage 3b.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13406",
    "action": "update",
    "description": "Chronic kidney disease stage 3b",
    "icd10cm": "N18.32",
    "snomed": "700378005",
    "onset": { "date": "2020-05-18", "precision": "day" }
  }
}
```
