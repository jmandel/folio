---
folio: "0.1"
id: "01H0FY20N07D81JSCYXMZ62TWQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00129076"
effective: "2023-05-15"
recorded: "2023-05-15T09:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 2018.</ref> History per pt, added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-16459",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2018-01-01", "precision": "year" },
    "visit_id": "V-2023-051562"
  }
}
```
