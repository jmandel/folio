---
folio: "0.1"
id: "01DSG7A9005FY61ST6DJPB8D5M"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00050237"
effective: "2019-11-12"
recorded: "2019-11-12T10:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential HTN, onset 6/2007 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14814",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "onset": { "date": "2007-06-16", "precision": "day" },
    "visit_id": "V-2019-111224"
  }
}
```
