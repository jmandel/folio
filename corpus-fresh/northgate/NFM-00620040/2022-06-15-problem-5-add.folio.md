---
folio: "0.1"
id: "01G5KVK0V0W12SRTE3CN5CRVKZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00620040"
effective: "2022-06-15"
recorded: "2022-06-15T09:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 12/2019.</ref> Added at first visit, history per pt.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12257",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2019-12-01", "precision": "month" },
    "restricted": "BH",
    "visit_id": "V-2022-061593"
  }
}
```
