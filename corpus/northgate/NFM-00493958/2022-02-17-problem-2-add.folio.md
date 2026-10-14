---
folio: "0.1"
id: "01FW45HVA0DCFDP2M3S3970PQ9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00493958"
effective: "2022-02-17"
recorded: "2022-02-17T09:42:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes, onset 2017 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11200",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2017-01-01", "precision": "year" },
    "visit_id": "V-2022-021799"
  }
}
```
