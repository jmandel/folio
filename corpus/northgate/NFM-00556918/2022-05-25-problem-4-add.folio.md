---
folio: "0.1"
id: "01G3YAPCY0JYGEEHK2GMGH3VTY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00556918"
effective: "2022-05-25"
recorded: "2022-05-25T14:22:00-05:00"
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
    "problem_id": "PL-14474",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2010-01-01", "precision": "year" },
    "visit_id": "V-2022-052513"
  }
}
```
