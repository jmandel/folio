---
folio: "0.1"
id: "01E3N1DBP0WB62R5WBT983DJ6S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00923727"
effective: "2020-03-17"
recorded: "2020-03-17T15:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 8/2012 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15590",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2012-08-01", "precision": "month" },
    "visit_id": "V-2020-031711"
  }
}
```
