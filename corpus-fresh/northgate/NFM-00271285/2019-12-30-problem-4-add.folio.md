---
folio: "0.1"
id: "01DXBMCGN0J9XQ9QD2AF11NMSC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00271285"
effective: "2019-12-30"
recorded: "2019-12-30T08:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild. Onset 11/2016 per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13499",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "onset": { "date": "2016-11-01", "precision": "month" },
    "restricted": "BH",
    "visit_id": "V-2019-123015"
  }
}
```
