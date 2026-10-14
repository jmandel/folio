---
folio: "0.1"
id: "01DQQMVPR08RT606VHYV8HPQGZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00205451"
effective: "2019-10-21"
recorded: "2019-10-21T12:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary OA of knee, onset ~6/2017 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14777",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "onset": { "date": "2017-06-01", "precision": "month" },
    "visit_id": "V-2019-102161"
  }
}
```
