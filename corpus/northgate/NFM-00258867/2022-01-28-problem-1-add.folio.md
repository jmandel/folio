---
folio: "0.1"
id: "01FTH3X7R00X94XSCFC6VRB0XY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00258867"
effective: "2022-01-28"
recorded: "2022-01-28T13:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 7/2009.</ref> Added at first visit, hx per pt.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17418",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2009-07-01", "precision": "month" },
    "visit_id": "V-2022-012891"
  }
}
```
