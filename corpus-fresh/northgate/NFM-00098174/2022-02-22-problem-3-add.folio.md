---
folio: "0.1"
id: "01FWH6P7R00Z8S40SZG3R3N63D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00098174"
effective: "2022-02-22"
recorded: "2022-02-22T11:12:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 9/2014 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11230",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2014-09-10", "precision": "day" },
    "visit_id": "V-2022-022255"
  }
}
```
