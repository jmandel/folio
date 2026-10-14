---
folio: "0.1"
id: "01D6XRC4T0GBRM6MB8WNJ65X66"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00484559"
effective: "2019-03-26"
recorded: "2019-03-26T14:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes, onset 2016 per pt. Added at first visit here.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12792",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2016-01-01", "precision": "year" },
    "visit_id": "V-2019-032617"
  }
}
```
