---
folio: "0.1"
id: "01DZC2WWC0X3NS59F0WVQ8WV6Y"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00388293"
effective: "2020-01-24"
recorded: "2020-01-24T09:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">DM2 since ~2010, per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10996",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2010-01-01", "precision": "year" },
    "visit_id": "V-2020-012423"
  }
}
```
