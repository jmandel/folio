---
folio: "0.1"
id: "01GTYRBYY0KTYZ5ZEBTE6NR2HZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00549835"
effective: "2023-03-07"
recorded: "2023-03-07T13:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hypothyroidism, dx 6/2008 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10584",
    "action": "add",
    "description": "Hypothyroidism",
    "icd10cm": "E03.9",
    "snomed": "40930008",
    "onset": { "date": "2008-06-02", "precision": "day" },
    "visit_id": "V-2023-030718"
  }
}
```
