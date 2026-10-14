---
folio: "0.1"
id: "01GFVCC520QB5563ZMHYDDE2Z8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00318619"
effective: "2022-10-20"
recorded: "2022-10-20T14:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 3/2008 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16277",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2008-03-04", "precision": "day" },
    "visit_id": "V-2022-102021"
  }
}
```
