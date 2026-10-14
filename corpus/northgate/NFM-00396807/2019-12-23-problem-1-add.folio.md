---
folio: "0.1"
id: "01DWSNADF0VHMZE9SWYSV4V6J5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00396807"
effective: "2019-12-23"
recorded: "2019-12-23T09:17:00-06:00"
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
    "problem_id": "PL-12024",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "onset": { "date": "2009-01-01", "precision": "year" },
    "visit_id": "V-2019-122355"
  }
}
```
