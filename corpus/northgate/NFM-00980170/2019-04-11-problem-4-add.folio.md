---
folio: "0.1"
id: "01D8745K707DVF5MKCXR3RG3G8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00980170"
effective: "2019-04-11"
recorded: "2019-04-11T16:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15891",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "onset": { "date": "2018-12-01", "precision": "month" },
    "restricted": "BH",
    "visit_id": "V-2019-041118"
  }
}
```
