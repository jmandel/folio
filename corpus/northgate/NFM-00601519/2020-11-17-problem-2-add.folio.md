---
folio: "0.1"
id: "01EQBEFP80Z5E1KX0ZX65JQM8Q"
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
<ref id="prob_1">Type 2 diabetes, onset 2009 per pt. Added at first visit here.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15047",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2009-01-01", "precision": "year" },
    "visit_id": "V-2020-111754"
  }
}
```
