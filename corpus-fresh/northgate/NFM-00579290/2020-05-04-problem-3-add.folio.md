---
folio: "0.1"
id: "01E7G51FC0CRPFHKC939RXB3J6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00579290"
effective: "2020-05-04"
recorded: "2020-05-04T10:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 10/2012.</ref> Added at first visit, hx per pt.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14467",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2012-10-01", "precision": "month" },
    "visit_id": "V-2020-050493"
  }
}
```
