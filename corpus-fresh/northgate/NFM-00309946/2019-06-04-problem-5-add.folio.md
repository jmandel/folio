---
folio: "0.1"
id: "01DCHMF330EPHVVVWRGVFY1J30"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00309946"
effective: "2019-06-04"
recorded: "2019-06-04T11:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild. Onset 2015 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13325",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "onset": { "date": "2015-01-01", "precision": "year" },
    "restricted": "BH",
    "visit_id": "V-2019-060445"
  }
}
```
