---
folio: "0.1"
id: "01DHVEZGG0GAEDEHEP4A684ZDJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00924817"
effective: "2019-08-09"
recorded: "2019-08-09T10:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2007 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17938",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "onset": { "date": "2007-01-01", "precision": "year" },
    "visit_id": "V-2019-080922"
  }
}
```
