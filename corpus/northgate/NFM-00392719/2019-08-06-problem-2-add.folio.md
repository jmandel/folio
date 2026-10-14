---
folio: "0.1"
id: "01DHKVGC30ZYJK9WE4HFX222NK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00392719"
effective: "2019-08-06"
recorded: "2019-08-06T11:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes mellitus, onset 2/21/2011.</ref> Hx per pt, first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17111",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2011-02-21", "precision": "day" },
    "visit_id": "V-2019-080672"
  }
}
```
