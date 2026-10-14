---
folio: "0.1"
id: "01DJWZ9FC0QBRSAZNBA3CF8AX7"
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
<ref id="prob_1">T2DM, onset 11/2012, history per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10869",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2012-11-01", "precision": "month" },
    "visit_id": "V-2019-082258"
  }
}
```
