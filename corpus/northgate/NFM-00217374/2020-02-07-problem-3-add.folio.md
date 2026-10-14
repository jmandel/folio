---
folio: "0.1"
id: "01E0G3AAG0W5R5X90RC2205ENQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00217374"
effective: "2020-02-07"
recorded: "2020-02-07T09:12:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary osteoarthritis of knee.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12982",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2019-03-28", "precision": "day" },
    "visit_id": "V-2020-020789"
  }
}
```
