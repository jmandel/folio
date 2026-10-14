---
folio: "0.1"
id: "01HB6RMZC02H6TK78VK3B9609D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00911754"
effective: "2023-09-25"
recorded: "2023-09-25T13:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9661",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2018-01-04", "precision": "day" },
    "restricted": "BH",
    "visit_id": "V-2023-092566"
  }
}
```
