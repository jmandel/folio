---
folio: "0.1"
id: "01GSTJSQC00NJ2BYA6XNH8FGXN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00696822"
effective: "2023-02-21"
recorded: "2023-02-21T12:12:00-06:00"
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
    "problem_id": "PL-11881",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2021-04-06", "precision": "day" },
    "visit_id": "V-2023-022166"
  }
}
```
