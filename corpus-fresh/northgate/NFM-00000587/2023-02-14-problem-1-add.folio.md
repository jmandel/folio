---
folio: "0.1"
id: "01GS8QQSR0EPBWSMEG84JAFVQB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00000587"
effective: "2023-02-14"
recorded: "2023-02-14T13:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension added, onset 2/2018 per pt.</ref> Entered at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14961",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2018-02-19", "precision": "day" },
    "visit_id": "V-2023-021475"
  }
}
```
