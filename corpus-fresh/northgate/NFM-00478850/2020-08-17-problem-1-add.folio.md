---
folio: "0.1"
id: "01EFYVMV60ETAN06DYTRD7MY1A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00478850"
effective: "2020-08-17"
recorded: "2020-08-17T13:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential HTN, onset 2011 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18012",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2011-01-01", "precision": "year" },
    "visit_id": "V-2020-081729"
  }
}
```
