---
folio: "0.1"
id: "01HTG5KFS07GPFH8PT0YFTM9WQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00813619"
effective: "2024-04-02"
recorded: "2024-04-02T14:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 9/2016 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18866",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2016-09-15", "precision": "day" },
    "visit_id": "V-2024-040211"
  }
}
```
