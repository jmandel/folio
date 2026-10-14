---
folio: "0.1"
id: "01G3Y4CZM0CQ3ZF1KNA4ERZMVM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00362442"
effective: "2022-05-25"
recorded: "2022-05-25T12:32:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Obesity, onset 11/2011 per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10017",
    "action": "add",
    "description": "Obesity",
    "icd10cm": "E66.9",
    "snomed": "414916001",
    "onset": { "date": "2011-11-01", "precision": "month" },
    "visit_id": "V-2022-052529"
  }
}
```
