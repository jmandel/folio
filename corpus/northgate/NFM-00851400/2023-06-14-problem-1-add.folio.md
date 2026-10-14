---
folio: "0.1"
id: "01H2X2HQ10012FVCMXG2BA1H2B"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00851400"
effective: "2023-06-14"
recorded: "2023-06-14T08:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Essential hypertension, onset 10/2017.</ref> Hx per pt, added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14686",
    "action": "add",
    "description": "Essential hypertension",
    "icd10cm": "I10",
    "snomed": "59621000",
    "onset": { "date": "2017-10-01", "precision": "month" },
    "visit_id": "V-2023-061472"
  }
}
```
