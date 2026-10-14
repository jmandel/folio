---
folio: "0.1"
id: "01EQBEFP809ZD5N8T6PB9KY341"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00601519"
effective: "2020-11-17"
recorded: "2020-11-17T09:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 11/2014 per pt. Added at first visit here.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19913",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2014-11-01", "precision": "month" },
    "visit_id": "V-2020-111754"
  }
}
```
