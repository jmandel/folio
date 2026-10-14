---
folio: "0.1"
id: "01GJDSNF00224E5QCRTKYH4RYJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00927255"
effective: "2022-11-21"
recorded: "2022-11-21T13:12:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hypothyroidism.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15211",
    "action": "add",
    "description": "Hypothyroidism",
    "icd10cm": "E03.9",
    "snomed": "40930008",
    "onset": { "date": "2015-01-01", "precision": "year" },
    "visit_id": "V-2022-112158"
  }
}
```
