---
folio: "0.1"
id: "01GPNSJAN0A5YB7MJ2A9RQH29D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00334426"
effective: "2023-01-13"
recorded: "2023-01-13T08:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes mellitus, onset 2016 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-17197",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2016-01-01", "precision": "year" },
    "visit_id": "V-2023-011319"
  }
}
```
