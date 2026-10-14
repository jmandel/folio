---
folio: "0.1"
id: "01F2KXJ0A0FV71X5RPHTESKVGW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00216607"
effective: "2021-04-06"
recorded: "2021-04-06T10:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">HFrEF, onset 2018.</ref> Hx per pt, added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16182",
    "action": "add",
    "description": "Heart failure with reduced ejection fraction",
    "icd10cm": "I50.22",
    "snomed": "703272007",
    "onset": { "date": "2018-01-01", "precision": "year" },
    "visit_id": "V-2021-040611"
  }
}
```
