---
folio: "0.1"
id: "01H85244W0W34KQ0YE9KKNC38H"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00939231"
effective: "2023-08-18"
recorded: "2023-08-18T14:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13095",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2021-01-01", "precision": "year" },
    "visit_id": "V-2023-081873"
  }
}
```
