---
folio: "0.1"
id: "01FPFTJTN0JKC1BKGTN8A287H0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00492858"
effective: "2021-12-09"
recorded: "2021-12-09T08:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes, onset 2014 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10289",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2014-01-01", "precision": "year" },
    "visit_id": "V-2021-120964"
  }
}
```
