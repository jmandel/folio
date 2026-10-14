---
folio: "0.1"
id: "01F5XKVMW0HPZN3P7079R0TTD8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00730945"
effective: "2021-05-17"
recorded: "2021-05-17T11:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential HTN, onset 2016 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13902",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2016-01-01", "precision": "year" },
    "visit_id": "V-2021-051789"
  }
}
```
