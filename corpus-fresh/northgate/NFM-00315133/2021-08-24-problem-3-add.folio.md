---
folio: "0.1"
id: "01FDW8M4T087DH0RVHT34PGX0A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00315133"
effective: "2021-08-24"
recorded: "2021-08-24T09:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 3/2009 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14211",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2009-03-15", "precision": "day" },
    "visit_id": "V-2021-082413"
  }
}
```
