---
folio: "0.1"
id: "01DARRVHV02J668AQKAXWV7AZT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759365"
effective: "2019-05-13"
recorded: "2019-05-13T09:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2008 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9457",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "onset": { "date": "2008-01-01", "precision": "year" },
    "visit_id": "V-2019-051326"
  }
}
```
