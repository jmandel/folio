---
folio: "0.1"
id: "01GR9CYJ90H4RC3HVHDP6WJDB7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00580006"
effective: "2023-02-02"
recorded: "2023-02-02T09:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 4/2015 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11157",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2015-04-01", "precision": "month" },
    "visit_id": "V-2023-020282"
  }
}
```
