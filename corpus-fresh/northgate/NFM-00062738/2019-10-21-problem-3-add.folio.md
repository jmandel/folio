---
folio: "0.1"
id: "01DQQE94F0M83Q4GCCPTB1B3CA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00062738"
effective: "2019-10-21"
recorded: "2019-10-21T10:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, since 2017 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9996",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "onset": { "date": "2017-01-01", "precision": "year" },
    "restricted": "BH",
    "visit_id": "V-2019-102173"
  }
}
```
