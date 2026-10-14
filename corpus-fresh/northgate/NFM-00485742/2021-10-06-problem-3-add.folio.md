---
folio: "0.1"
id: "01FHBEK460Y22WXYJRR26DQX31"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00485742"
effective: "2021-10-06"
recorded: "2021-10-06T13:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 5/2011 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11058",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2011-05-14", "precision": "day" },
    "visit_id": "V-2021-100637"
  }
}
```
