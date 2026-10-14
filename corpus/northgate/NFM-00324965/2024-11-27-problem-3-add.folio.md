---
folio: "0.1"
id: "01JDQ3E1E0JZ5NJ42VV7KH06DA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00324965"
effective: "2024-11-27"
recorded: "2024-11-27T09:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, dx 4/2019 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12913",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2019-04-01", "precision": "month" },
    "visit_id": "V-2024-112754"
  }
}
```
