---
folio: "0.1"
id: "01FGKY4RC01FZC4PNGGXYK4E3P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00922389"
effective: "2021-09-27"
recorded: "2021-09-27T10:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes, onset 2015, per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13021",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2015-01-01", "precision": "year" },
    "visit_id": "V-2021-092747"
  }
}
```
