---
folio: "0.1"
id: "01FXB1GZE0AR7ZGW4WGWCP8FX9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00171449"
effective: "2022-03-04"
recorded: "2022-03-04T12:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 8/2011 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9364",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2011-08-01", "precision": "month" },
    "visit_id": "V-2022-030457"
  }
}
```
