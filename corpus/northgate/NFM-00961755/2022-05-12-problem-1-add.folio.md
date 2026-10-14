---
folio: "0.1"
id: "01G2WST440MBTD861T7DQWBZ56"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00961755"
effective: "2022-05-12"
recorded: "2022-05-12T13:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes, onset 2010 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16952",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2010-01-01", "precision": "year" },
    "visit_id": "V-2022-051298"
  }
}
```
