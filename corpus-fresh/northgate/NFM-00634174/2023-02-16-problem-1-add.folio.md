---
folio: "0.1"
id: "01GSE53WT0D0MYFRC1QR4NSWGT"
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
<ref id="prob_1">Essential HTN, onset 3/2009 per pt. Added at first visit.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17353",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2009-03-01", "precision": "month" },
    "visit_id": "V-2023-021617"
  }
}
```
