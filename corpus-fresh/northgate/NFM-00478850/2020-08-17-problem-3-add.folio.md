---
folio: "0.1"
id: "01EFYVMV60A0KSKNWW6RCJ51K0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00478850"
effective: "2020-08-17"
recorded: "2020-08-17T13:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 2018 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9149",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2018-01-01", "precision": "year" },
    "visit_id": "V-2020-081729"
  }
}
```
