---
folio: "0.1"
id: "01DPKG4Y305JN3RHCF1X10Z9XV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00673395"
effective: "2019-10-07"
recorded: "2019-10-07T11:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">DM2, onset 2010, per pt history. Added at first visit here.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13276",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2010-01-01", "precision": "year" },
    "visit_id": "V-2019-100779"
  }
}
```
