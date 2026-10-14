---
folio: "0.1"
id: "01DDXKSWC0HYDHPBZ3RFSWPX4M"
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
<ref id="prob_1">HFrEF, onset 5/2016.</ref> Hx per pt, added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17157",
    "action": "add",
    "description": "Heart failure with reduced ejection fraction",
    "icd10cm": "I50.22",
    "onset": { "date": "2016-05-01", "precision": "month" },
    "visit_id": "V-2019-062176"
  }
}
```
