---
folio: "0.1"
id: "01DZC2WWC0G81GZZ3VGTNFM6MK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00388293"
effective: "2020-01-24"
recorded: "2020-01-24T09:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10528",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2007-01-01", "precision": "year" },
    "visit_id": "V-2020-012423"
  }
}
```
