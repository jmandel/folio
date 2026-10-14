---
folio: "0.1"
id: "01G54J2BA01PXF51R61TDVW2PT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00953498"
effective: "2022-06-09"
recorded: "2022-06-09T10:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 2021, per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16016",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2021-01-01", "precision": "year" },
    "restricted": "BH",
    "visit_id": "V-2022-060992"
  }
}
```
