---
folio: "0.1"
id: "01GF93JRY0GR4DQXFQH19BR7BV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00133783"
effective: "2022-10-13"
recorded: "2022-10-13T11:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2008.</ref> Hx per pt, added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18848",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2008-01-01", "precision": "year" },
    "visit_id": "V-2022-101345"
  }
}
```
