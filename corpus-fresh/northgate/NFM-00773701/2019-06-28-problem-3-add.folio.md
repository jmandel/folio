---
folio: "0.1"
id: "01DEFMW2B0MKNFS3DZY6B8QN7Y"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00773701"
effective: "2019-06-28"
recorded: "2019-06-28T13:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia since ~2013 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15138",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "onset": { "date": "2013-01-01", "precision": "year" },
    "visit_id": "V-2019-062896"
  }
}
```
