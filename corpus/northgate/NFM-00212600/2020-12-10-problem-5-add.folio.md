---
folio: "0.1"
id: "01ES79Y810F3QJ3G55A7P785S4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00212600"
effective: "2020-12-10"
recorded: "2020-12-10T15:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 2015.</ref> Hx per pt, added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9862",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2015-01-01", "precision": "year" },
    "restricted": "BH",
    "visit_id": "V-2020-121035"
  }
}
```
