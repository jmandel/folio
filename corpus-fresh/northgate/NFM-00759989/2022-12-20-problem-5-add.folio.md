---
folio: "0.1"
id: "01GMR5F1200WT7Y0YJCP1XNW94"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759989"
effective: "2022-12-20"
recorded: "2022-12-20T10:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hypothyroidism, onset 2009 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12828",
    "action": "add",
    "description": "Hypothyroidism",
    "icd10cm": "E03.9",
    "snomed": "40930008",
    "onset": { "date": "2009-01-01", "precision": "year" },
    "visit_id": "V-2022-122053"
  }
}
```
