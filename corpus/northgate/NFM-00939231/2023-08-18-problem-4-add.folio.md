---
folio: "0.1"
id: "01H85244W03GV1760ASH640RAA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00939231"
effective: "2023-08-18"
recorded: "2023-08-18T14:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
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
    "problem_id": "PL-9128",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2017-01-01", "precision": "year" },
    "restricted": "BH",
    "visit_id": "V-2023-081873"
  }
}
```
