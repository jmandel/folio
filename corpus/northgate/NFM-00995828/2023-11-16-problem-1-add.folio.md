---
folio: "0.1"
id: "01HFCW62M031SF8E3KFVQ0XQ4G"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00995828"
effective: "2023-11-16"
recorded: "2023-11-16T14:12:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential HTN, onset 3/2017.</ref> Hx per pt, added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9765",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2017-03-01", "precision": "month" },
    "visit_id": "V-2023-111671"
  }
}
```
