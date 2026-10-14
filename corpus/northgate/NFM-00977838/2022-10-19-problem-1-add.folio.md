---
folio: "0.1"
id: "01GFRJHCW0SZSQ5R8J9VQ37WF7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00977838"
effective: "2022-10-19"
recorded: "2022-10-19T11:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2012 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14051",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2012-01-01", "precision": "year" },
    "visit_id": "V-2022-101911"
  }
}
```
