---
folio: "0.1"
id: "01EQEB6040X2T8DMXKJ6EYYEF5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00597008"
effective: "2020-11-18"
recorded: "2020-11-18T12:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Major depressive disorder, recurrent, mild, onset 12/2018.</ref> Hx per pt, added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11989",
    "action": "add",
    "description": "Major depressive disorder, recurrent, mild",
    "icd10cm": "F33.0",
    "snomed": "191611001",
    "onset": { "date": "2018-12-01", "precision": "month" },
    "restricted": "BH",
    "visit_id": "V-2020-111897"
  }
}
```
