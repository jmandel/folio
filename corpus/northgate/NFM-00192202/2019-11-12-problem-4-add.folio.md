---
folio: "0.1"
id: "01DSG4EQA0X9Y3BCTF9CJ362C7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00192202"
effective: "2019-11-12"
recorded: "2019-11-12T09:42:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 9/2015 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14879",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "onset": { "date": "2015-09-01", "precision": "month" },
    "visit_id": "V-2019-111295"
  }
}
```
