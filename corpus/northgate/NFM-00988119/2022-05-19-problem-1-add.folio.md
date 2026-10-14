---
folio: "0.1"
id: "01G3ERW7A0TK7QJ34WNK2CNBWJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00988119"
effective: "2022-05-19"
recorded: "2022-05-19T13:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 1/2018 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9246",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2018-01-03", "precision": "day" },
    "visit_id": "V-2022-051923"
  }
}
```
