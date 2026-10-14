---
folio: "0.1"
id: "01GXTYY9N0YJ7E6PFYN66ZHYB8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00409706"
effective: "2023-04-12"
recorded: "2023-04-12T09:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 2/4/2021 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16739",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2021-02-04", "precision": "day" },
    "restricted": "BH",
    "visit_id": "V-2023-041298"
  }
}
```
