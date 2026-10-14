---
folio: "0.1"
id: "01EPCXEDZ0MK0PMA30JA8YR6KF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00337133"
effective: "2020-11-05"
recorded: "2020-11-05T13:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2/2017 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17757",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2017-02-01", "precision": "month" },
    "visit_id": "V-2020-110515"
  }
}
```
