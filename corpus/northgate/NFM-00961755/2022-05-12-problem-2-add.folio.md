---
folio: "0.1"
id: "01G2WST440786P91S87M6716Q5"
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
<ref id="prob_1">Hyperlipidemia, onset 2016 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12786",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2016-01-01", "precision": "year" },
    "visit_id": "V-2022-051298"
  }
}
```
