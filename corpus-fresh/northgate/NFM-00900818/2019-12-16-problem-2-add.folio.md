---
folio: "0.1"
id: "01DW86J5G0J0N4B5Z49833JYMD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00900818"
effective: "2019-12-16"
recorded: "2019-12-16T14:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes, onset 4/2007 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14962",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2007-04-02", "precision": "day" },
    "visit_id": "V-2019-121612"
  }
}
```
