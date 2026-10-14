---
folio: "0.1"
id: "01E8M5EXG08Z20W635JYKV4XYK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00387375"
effective: "2020-05-18"
recorded: "2020-05-18T10:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 4/2010 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12513",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2010-04-19", "precision": "day" },
    "visit_id": "V-2020-051885"
  }
}
```
