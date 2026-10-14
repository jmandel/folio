---
folio: "0.1"
id: "01EPW585P01K5E7TT8QZTHE1JG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00727449"
effective: "2020-11-11"
recorded: "2020-11-11T11:22:00-06:00"
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
    "problem_id": "PL-10851",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2008-01-01", "precision": "year" },
    "visit_id": "V-2020-111172"
  }
}
```
