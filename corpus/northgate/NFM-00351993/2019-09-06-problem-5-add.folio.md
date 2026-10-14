---
folio: "0.1"
id: "01DM3ENRW060N8X87RZ3AQ8D95"
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
<ref id="prob_1">Hypothyroidism, onset 5/2014 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17217",
    "action": "add",
    "description": "Hypothyroidism",
    "icd10cm": "E03.9",
    "onset": { "date": "2014-05-01", "precision": "month" },
    "visit_id": "V-2019-090668"
  }
}
```
