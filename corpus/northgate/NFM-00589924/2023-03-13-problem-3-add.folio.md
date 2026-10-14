---
folio: "0.1"
id: "01GVEDM060R0BDVX96ZCNNKZYX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00589924"
effective: "2023-03-13"
recorded: "2023-03-13T16:22:00-05:00"
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
    "problem_id": "PL-19732",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2021-11-01", "precision": "month" },
    "restricted": "BH",
    "visit_id": "V-2023-031373"
  }
}
```
