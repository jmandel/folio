---
folio: "0.1"
id: "01H91H2HC06GEVSW2YBCVRQE9N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00609706"
effective: "2023-08-29"
recorded: "2023-08-29T15:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, since about 2020 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9084",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2020-01-01", "precision": "year" },
    "restricted": "BH",
    "visit_id": "V-2023-082975"
  }
}
```
