---
folio: "0.1"
id: "01G3YAPCY0Z208906850JR8FX4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00556918"
effective: "2022-05-25"
recorded: "2022-05-25T14:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 7/2013 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16011",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2013-07-01", "precision": "month" },
    "visit_id": "V-2022-052513"
  }
}
```
