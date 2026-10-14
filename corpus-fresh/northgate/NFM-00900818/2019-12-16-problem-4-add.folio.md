---
folio: "0.1"
id: "01DW86J5G0H7MJ72FM845ZY0SY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00900818"
effective: "2019-12-16"
recorded: "2019-12-16T14:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 2019 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15883",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "onset": { "date": "2019-01-01", "precision": "year" },
    "restricted": "BH",
    "visit_id": "V-2019-121612"
  }
}
```
