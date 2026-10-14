---
folio: "0.1"
id: "01D6GGN630EMMVA90AV7W7PG1W"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00631848"
effective: "2019-03-21"
recorded: "2019-03-21T11:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary OA of knee added, onset 1/2017.</ref> Hx per pt, first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13230",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "onset": { "date": "2017-01-25", "precision": "day" },
    "visit_id": "V-2019-032149"
  }
}
```
