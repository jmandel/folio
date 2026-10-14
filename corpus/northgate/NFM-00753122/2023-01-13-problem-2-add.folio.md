---
folio: "0.1"
id: "01GPP0E1X0ED60TVK8RCCKCAM5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00753122"
effective: "2023-01-13"
recorded: "2023-01-13T10:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 1/2020 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11968",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2020-01-01", "precision": "month" },
    "visit_id": "V-2023-011394"
  }
}
```
