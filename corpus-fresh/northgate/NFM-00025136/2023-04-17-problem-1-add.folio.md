---
folio: "0.1"
id: "01GY7S6YV02QVPNM0VR2D3VRTV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00025136"
effective: "2023-04-17"
recorded: "2023-04-17T09:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential HTN, onset ~9/2017.</ref> Hx per pt, added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17733",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2017-09-23", "precision": "day" },
    "visit_id": "V-2023-041748"
  }
}
```
