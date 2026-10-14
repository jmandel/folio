---
folio: "0.1"
id: "01ECN06D60EK01P0B25W5E48X5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00819371"
effective: "2020-07-07"
recorded: "2020-07-07T11:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 2018.</ref> Added at first visit, hx per pt.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12337",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2018-01-01", "precision": "year" },
    "restricted": "BH",
    "visit_id": "V-2020-070731"
  }
}
```
