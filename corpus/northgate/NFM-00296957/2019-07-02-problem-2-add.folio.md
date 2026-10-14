---
folio: "0.1"
id: "01DESV12Q06MZND23GBJPPG5EZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00296957"
effective: "2019-07-02"
recorded: "2019-07-02T12:17:00-05:00"
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
    "problem_id": "PL-12450",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "onset": { "date": "2012-10-01", "precision": "month" },
    "visit_id": "V-2019-070252"
  }
}
```
