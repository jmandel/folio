---
folio: "0.1"
id: "01E43ZFTF0SAGVBMK8JSZM11WY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00952210"
effective: "2020-03-23"
recorded: "2020-03-23T10:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia since ~1/2012, per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16317",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2012-01-01", "precision": "month" },
    "visit_id": "V-2020-032339"
  }
}
```
