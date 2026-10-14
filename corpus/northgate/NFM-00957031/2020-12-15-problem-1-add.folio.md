---
folio: "0.1"
id: "01ESKN1NW0M97HMK372NPKGAEQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00957031"
effective: "2020-12-15"
recorded: "2020-12-15T10:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 12/2010 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19966",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2010-12-01", "precision": "month" },
    "visit_id": "V-2020-121559"
  }
}
```
