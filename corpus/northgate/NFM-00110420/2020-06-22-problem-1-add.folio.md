---
folio: "0.1"
id: "01EBE8SRJ06Y3SPKEM4TTZG5RX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00110420"
effective: "2020-06-22"
recorded: "2020-06-22T10:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2/2015 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11527",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2015-02-09", "precision": "day" },
    "visit_id": "V-2020-062232"
  }
}
```
