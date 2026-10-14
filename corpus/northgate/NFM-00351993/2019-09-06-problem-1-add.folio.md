---
folio: "0.1"
id: "01DM3ENRW0E1K26026275N8ZP7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00351993"
effective: "2019-09-06"
recorded: "2019-09-06T09:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 9/2013 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11371",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "onset": { "date": "2013-09-09", "precision": "day" },
    "visit_id": "V-2019-090668"
  }
}
```
