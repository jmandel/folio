---
folio: "0.1"
id: "01FW76TMP036S9PHMJ665PVSYC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00276077"
effective: "2022-02-18"
recorded: "2022-02-18T14:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2010.</ref> Hx per pt, added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11368",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2010-01-01", "precision": "year" },
    "visit_id": "V-2022-021842"
  }
}
```
