---
folio: "0.1"
id: "01DPP13W808WRYCSDEBCRPA94V"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00674394"
effective: "2019-10-08"
recorded: "2019-10-08T10:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2015.</ref> History per pt, added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17121",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "onset": { "date": "2015-01-01", "precision": "year" },
    "visit_id": "V-2019-100895"
  }
}
```
