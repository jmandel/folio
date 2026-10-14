---
folio: "0.1"
id: "01E8A30XQ0B27N9KZAPG54C5XQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00516657"
effective: "2020-05-14"
recorded: "2020-05-14T12:17:00-05:00"
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
    "problem_id": "PL-19451",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2013-01-01", "precision": "year" },
    "visit_id": "V-2020-051412"
  }
}
```
