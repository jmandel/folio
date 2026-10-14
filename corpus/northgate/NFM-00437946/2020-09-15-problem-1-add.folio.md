---
folio: "0.1"
id: "01EJ9AW8W0ZY81A678T110ZVA3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00437946"
effective: "2020-09-15"
recorded: "2020-09-15T11:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 11/2011, per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17289",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2011-11-01", "precision": "month" },
    "visit_id": "V-2020-091528"
  }
}
```
