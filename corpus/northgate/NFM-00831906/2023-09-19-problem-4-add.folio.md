---
folio: "0.1"
id: "01HAQEV4W0PFD7VHEFE9WME5DA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00831906"
effective: "2023-09-19"
recorded: "2023-09-19T14:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 6/2013 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14083",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2013-06-12", "precision": "day" },
    "visit_id": "V-2023-091957"
  }
}
```
