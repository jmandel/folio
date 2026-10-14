---
folio: "0.1"
id: "01GSE53WT0BDGG18S0PT36CBDT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00634174"
effective: "2023-02-16"
recorded: "2023-02-16T16:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild. Onset 4/2019 per pt. Added at first visit.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10024",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2019-04-01", "precision": "month" },
    "restricted": "BH",
    "visit_id": "V-2023-021617"
  }
}
```
