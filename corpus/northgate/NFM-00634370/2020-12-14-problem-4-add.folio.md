---
folio: "0.1"
id: "01ESGYXY90VQMZ2TXSS7Z2XFN7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00634370"
effective: "2020-12-14"
recorded: "2020-12-14T09:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 2/2017 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10243",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2017-02-01", "precision": "month" },
    "restricted": "BH",
    "visit_id": "V-2020-121453"
  }
}
```
