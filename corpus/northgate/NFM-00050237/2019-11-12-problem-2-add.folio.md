---
folio: "0.1"
id: "01DSG7A900EXMPP1BTDH4A0CYD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00050237"
effective: "2019-11-12"
recorded: "2019-11-12T10:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11833",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "onset": { "date": "2015-06-01", "precision": "month" },
    "visit_id": "V-2019-111224"
  }
}
```
