---
folio: "0.1"
id: "01EEX662W0N5TRYERT496AXVQA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00927471"
effective: "2020-08-04"
recorded: "2020-08-04T11:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential HTN, onset 7/2011 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12694",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2011-07-27", "precision": "day" },
    "visit_id": "V-2020-080481"
  }
}
```
