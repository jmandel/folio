---
folio: "0.1"
id: "01ET2W93N0JD9TFEMTQ5DF0W5F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00172148"
effective: "2020-12-21"
recorded: "2020-12-21T08:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia since 3/2011, per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9631",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2011-03-01", "precision": "month" },
    "visit_id": "V-2020-122112"
  }
}
```
