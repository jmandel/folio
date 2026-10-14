---
folio: "0.1"
id: "01J87V8C006P71W7TQZXSDKVYE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00439272"
effective: "2024-09-20"
recorded: "2024-09-20T08:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 2018 per pt. Added at first visit.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17378",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2018-01-01", "precision": "year" },
    "restricted": "BH",
    "visit_id": "V-2024-092024"
  }
}
```
