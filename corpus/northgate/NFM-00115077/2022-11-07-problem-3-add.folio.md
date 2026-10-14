---
folio: "0.1"
id: "01GHA18C00RE7JYRF6GK4K3CS2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00115077"
effective: "2022-11-07"
recorded: "2022-11-07T15:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Hyperlipidemia.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10270",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2016-06-01", "precision": "month" },
    "visit_id": "V-2022-110738"
  }
}
```
