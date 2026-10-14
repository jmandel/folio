---
folio: "0.1"
id: "01E2ZZXV80ECHCA5MMX3NCRDXY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00738336"
effective: "2020-03-09"
recorded: "2020-03-09T10:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 6/2011.</ref> Hx per pt, added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19020",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2011-06-01", "precision": "month" },
    "visit_id": "V-2020-030986"
  }
}
```
