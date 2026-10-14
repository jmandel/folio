---
folio: "0.1"
id: "01FVN6X2K0NY7T5HTKDT7H0JAX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00725765"
effective: "2022-02-11"
recorded: "2022-02-11T14:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential HTN, onset 5/2017 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16406",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2017-05-01", "precision": "month" },
    "visit_id": "V-2022-021125"
  }
}
```
