---
folio: "0.1"
id: "01D4JMHHC0ZDE9F8XQ6P85VZAJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00017276"
effective: "2019-02-25"
recorded: "2019-02-25T09:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia added, onset 2010 per pt.</ref> History from first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17846",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "onset": { "date": "2010-01-01", "precision": "year" },
    "visit_id": "V-2019-022599"
  }
}
```
