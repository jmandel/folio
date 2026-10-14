---
folio: "0.1"
id: "01DQ8DXDY09ZFWP4Q04H4K4PJZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00058829"
effective: "2019-10-15"
recorded: "2019-10-15T14:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2005 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18538",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "onset": { "date": "2005-01-01", "precision": "year" },
    "visit_id": "V-2019-101527"
  }
}
```
