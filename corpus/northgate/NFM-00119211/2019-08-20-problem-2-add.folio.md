---
folio: "0.1"
id: "01DJR5BY60ZWNZTCG4SM6464GX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00119211"
effective: "2019-08-20"
recorded: "2019-08-20T13:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 2015.</ref> Added at first visit, hx per pt.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15110",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "onset": { "date": "2015-01-01", "precision": "year" },
    "visit_id": "V-2019-082023"
  }
}
```
