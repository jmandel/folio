---
folio: "0.1"
id: "01ER5DAKG0YS8N5169HCTRP383"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00773673"
effective: "2020-11-27"
recorded: "2020-11-27T11:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 2012 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18126",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2012-01-01", "precision": "year" },
    "visit_id": "V-2020-112789"
  }
}
```
