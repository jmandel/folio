---
folio: "0.1"
id: "01E7JMVSN0F3R4ZPYFRKNWZFGR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00522444"
effective: "2020-05-05"
recorded: "2020-05-05T09:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 2013 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17725",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2013-01-01", "precision": "year" },
    "visit_id": "V-2020-050576"
  }
}
```
