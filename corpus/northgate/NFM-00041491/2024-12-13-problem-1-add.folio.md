---
folio: "0.1"
id: "01JF0NGX50GNDTVNXBZNDS5BN2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00041491"
effective: "2024-12-13"
recorded: "2024-12-13T12:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential HTN, onset 2016, per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14210",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2016-01-01", "precision": "year" },
    "visit_id": "V-2024-121378"
  }
}
```
