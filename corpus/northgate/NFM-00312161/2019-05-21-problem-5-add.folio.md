---
folio: "0.1"
id: "01DBDAAC10M91NB35K92PFPNXQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00312161"
effective: "2019-05-21"
recorded: "2019-05-21T08:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary osteoarthritis of knee, onset 10/2012 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18288",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "onset": { "date": "2012-10-13", "precision": "day" },
    "visit_id": "V-2019-052136"
  }
}
```
