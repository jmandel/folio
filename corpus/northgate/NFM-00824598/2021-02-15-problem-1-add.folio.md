---
folio: "0.1"
id: "01EYKBD5P0AZPRWQE5MA6D7MP4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00824598"
effective: "2021-02-15"
recorded: "2021-02-15T11:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes mellitus, onset 6/2012 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13250",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2012-06-01", "precision": "month" },
    "visit_id": "V-2021-021589"
  }
}
```
