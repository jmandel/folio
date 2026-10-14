---
folio: "0.1"
id: "01HJH8HFR0869P5K9X9RJ0MPMN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00770227"
effective: "2023-12-25"
recorded: "2023-12-25T13:52:00-06:00"
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
    "problem_id": "PL-10941",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2014-10-01", "precision": "month" },
    "visit_id": "V-2023-122513"
  }
}
```
