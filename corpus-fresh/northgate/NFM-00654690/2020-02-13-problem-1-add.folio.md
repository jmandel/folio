---
folio: "0.1"
id: "01E0ZMJ660Q7Q4S4W2QG986JJX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00654690"
effective: "2020-02-13"
recorded: "2020-02-13T10:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential HTN, onset 12/2014 per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12683",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2014-12-01", "precision": "month" },
    "visit_id": "V-2020-021382"
  }
}
```
