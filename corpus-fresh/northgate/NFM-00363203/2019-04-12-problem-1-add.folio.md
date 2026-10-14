---
folio: "0.1"
id: "01D88X3G00X05YN1JSGP016MSD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00363203"
effective: "2019-04-12"
recorded: "2019-04-12T08:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2007.</ref> Hx per pt, added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15678",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "onset": { "date": "2007-01-01", "precision": "year" },
    "visit_id": "V-2019-041226"
  }
}
```
