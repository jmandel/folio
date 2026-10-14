---
folio: "0.1"
id: "01E6F8RCA00QJ5SSNF4XEF742E"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00323182"
effective: "2020-04-21"
recorded: "2020-04-21T16:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12717",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2018-07-25", "precision": "day" },
    "visit_id": "V-2020-042132"
  }
}
```
