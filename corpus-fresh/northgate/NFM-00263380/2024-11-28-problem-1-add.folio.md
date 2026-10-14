---
folio: "0.1"
id: "01JDT8DVD0SFQNPE5YBF35GAVP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00263380"
effective: "2024-11-28"
recorded: "2024-11-28T14:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 10/2013.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9957",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2013-10-01", "precision": "month" },
    "visit_id": "V-2024-112887"
  }
}
```
