---
folio: "0.1"
id: "01FX13YM405K25AG79EGSS9DNN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00871242"
effective: "2022-02-28"
recorded: "2022-02-28T15:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 7/2017 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16350",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2017-07-01", "precision": "month" },
    "visit_id": "V-2022-022878"
  }
}
```
