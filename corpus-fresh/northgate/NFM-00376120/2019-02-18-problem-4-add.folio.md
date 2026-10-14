---
folio: "0.1"
id: "01D410BB00A7Z44YQ8H8AJ271T"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00376120"
effective: "2019-02-18"
recorded: "2019-02-18T13:12:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 10/2016. Per pt, added at first visit here.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13896",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "onset": { "date": "2016-10-01", "precision": "month" },
    "restricted": "BH",
    "visit_id": "V-2019-021825"
  }
}
```
