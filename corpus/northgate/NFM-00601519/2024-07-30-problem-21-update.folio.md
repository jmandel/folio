---
folio: "0.1"
id: "01J42KTA90WXN7FCMWW4F5JQSR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00601519"
effective: "2024-07-30"
recorded: "2024-07-30T15:03:00-05:00"
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
    "problem_id": "PL-12291",
    "action": "update",
    "description": "Chronic kidney disease stage 3b",
    "icd10cm": "N18.32",
    "snomed": "700378005",
    "onset": { "date": "2021-03-31", "precision": "day" },
    "visit_id": "V-2024-073094"
  }
}
```
