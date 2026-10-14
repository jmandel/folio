---
folio: "0.1"
id: "01DDXKSWC0TXWZMYTKWESH6BPW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00767475"
effective: "2019-06-21"
recorded: "2019-06-21T13:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 2011.</ref> Hx per pt, added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9756",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "onset": { "date": "2011-01-01", "precision": "year" },
    "visit_id": "V-2019-062176"
  }
}
```
