---
folio: "0.1"
id: "01DGJPMKZ03F6WPJZ848TTJP0E"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00739548"
effective: "2019-07-24"
recorded: "2019-07-24T14:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12725",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "onset": { "date": "2014-01-01", "precision": "year" },
    "visit_id": "V-2019-072434"
  }
}
```
