---
folio: "0.1"
id: "01EP9VWFM0P9GD8WXY2ZRBJNGA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00927456"
effective: "2020-11-04"
recorded: "2020-11-04T08:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">HTN since ~7/2007, per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14665",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2007-07-09", "precision": "day" },
    "visit_id": "V-2020-110498"
  }
}
```
