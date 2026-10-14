---
folio: "0.1"
id: "01D4JMHHC0CV9GTVRZ8CZPSXXZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00017276"
effective: "2019-02-25"
recorded: "2019-02-25T09:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes mellitus.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19192",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2016-01-01", "precision": "year" },
    "visit_id": "V-2019-022599"
  }
}
```
