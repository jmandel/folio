---
folio: "0.1"
id: "01EAAQ8CT08ZCQ9C6WNTZZC5R6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00892695"
effective: "2020-06-08"
recorded: "2020-06-08T14:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12954",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2014-01-01", "precision": "year" },
    "visit_id": "V-2020-060816"
  }
}
```
