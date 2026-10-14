---
folio: "0.1"
id: "01EN34FV00R903H09MTVXX5AJM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00080015"
effective: "2020-10-20"
recorded: "2020-10-20T08:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia since 4/2011, per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14806",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2011-04-01", "precision": "month" },
    "visit_id": "V-2020-102078"
  }
}
```
