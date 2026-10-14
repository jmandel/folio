---
folio: "0.1"
id: "01DJWZ9FC0VSTPDCEE91SP8170"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00103205"
effective: "2019-08-22"
recorded: "2019-08-22T10:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia, onset 2015, history per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9084",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "onset": { "date": "2015-01-01", "precision": "year" },
    "visit_id": "V-2019-082258"
  }
}
```
