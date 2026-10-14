---
folio: "0.1"
id: "01EYKBD5P0ZJD01ZQ2H6Y0MEY8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00824598"
effective: "2021-02-15"
recorded: "2021-02-15T11:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-11860",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2007-09-01", "precision": "month" },
    "visit_id": "V-2021-021589"
  }
}
```
