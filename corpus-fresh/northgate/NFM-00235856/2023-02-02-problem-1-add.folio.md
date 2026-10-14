---
folio: "0.1"
id: "01GR9TZ5R0KZXJ6ENMWXZ7EE36"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00235856"
effective: "2023-02-02"
recorded: "2023-02-02T13:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2010 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10197",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2010-01-01", "precision": "year" },
    "visit_id": "V-2023-020292"
  }
}
```
