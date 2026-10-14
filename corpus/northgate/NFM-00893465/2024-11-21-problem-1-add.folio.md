---
folio: "0.1"
id: "01JD8CGEW0253WX18AD3EM1KC8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00893465"
effective: "2024-11-21"
recorded: "2024-11-21T16:12:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">HTN since 3/2016 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15431",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2016-03-01", "precision": "month" },
    "visit_id": "V-2024-112124"
  }
}
```
