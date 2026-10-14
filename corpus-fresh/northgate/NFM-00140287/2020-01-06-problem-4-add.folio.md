---
folio: "0.1"
id: "01DXYBRT6049YAHB3SX5E7Z1B7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00140287"
effective: "2020-01-06"
recorded: "2020-01-06T15:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 2015 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10388",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2015-01-01", "precision": "year" },
    "restricted": "BH",
    "visit_id": "V-2020-010675"
  }
}
```
