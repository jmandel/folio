---
folio: "0.1"
id: "01DECP5NP0BJYEDWE3VT8TP1TE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00342977"
effective: "2019-06-27"
recorded: "2019-06-27T09:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2007.</ref> Added at first visit here, history per pt.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15913",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "onset": { "date": "2007-01-01", "precision": "year" },
    "visit_id": "V-2019-062733"
  }
}
```
