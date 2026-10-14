---
folio: "0.1"
id: "01J4PRMF8056RVM6DXKAYC3Y9K"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00984913"
effective: "2024-08-07"
recorded: "2024-08-07T10:52:00-05:00"
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
    "problem_id": "PL-15074",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2022-10-01", "precision": "month" },
    "visit_id": "V-2024-080723"
  }
}
```
