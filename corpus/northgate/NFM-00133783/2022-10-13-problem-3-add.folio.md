---
folio: "0.1"
id: "01GF93JRY0DNK090FZ259WWZ9R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00133783"
effective: "2022-10-13"
recorded: "2022-10-13T11:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 2015.</ref> Hx per pt, added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13220",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2015-01-01", "precision": "year" },
    "visit_id": "V-2022-101345"
  }
}
```
