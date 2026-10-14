---
folio: "0.1"
id: "01GHVC9KC01K9WV2KTDZZ6QSJZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00937270"
effective: "2022-11-14"
recorded: "2022-11-14T09:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary osteoarthritis of knee.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10419",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2015-01-01", "precision": "year" },
    "visit_id": "V-2022-111413"
  }
}
```
