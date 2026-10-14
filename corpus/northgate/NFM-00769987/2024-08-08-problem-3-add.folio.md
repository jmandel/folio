---
folio: "0.1"
id: "01J4S7KAM029PQPGHF55E3XY64"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00769987"
effective: "2024-08-08"
recorded: "2024-08-08T09:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">HFrEF, onset 2021 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16792",
    "action": "add",
    "description": "Heart failure with reduced ejection fraction",
    "icd10cm": "I50.22",
    "snomed": "703272007",
    "onset": { "date": "2021-01-01", "precision": "year" },
    "visit_id": "V-2024-080853"
  }
}
```
