---
folio: "0.1"
id: "01D19E8K20YA0D9PFXYR9E9SP0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00748302"
effective: "2019-01-15"
recorded: "2019-01-15T13:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential HTN, onset 8/2014 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11533",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "onset": { "date": "2014-08-01", "precision": "day" },
    "visit_id": "V-2019-011597"
  }
}
```
