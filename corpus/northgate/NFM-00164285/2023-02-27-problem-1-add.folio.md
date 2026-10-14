---
folio: "0.1"
id: "01GT9YAFP0CM6XZCZC4MGYH74S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00164285"
effective: "2023-02-27"
recorded: "2023-02-27T11:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2020 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13059",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2020-01-01", "precision": "year" },
    "visit_id": "V-2023-022729"
  }
}
```
