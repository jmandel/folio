---
folio: "0.1"
id: "01DQDBHZQ03T0RQW83D9Y90EGQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00701178"
effective: "2019-10-17"
recorded: "2019-10-17T12:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 2010 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15613",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "onset": { "date": "2010-01-01", "precision": "year" },
    "visit_id": "V-2019-101748"
  }
}
```
