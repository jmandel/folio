---
folio: "0.1"
id: "01JD0DW8P0B2WHHJ14MZ9VRX79"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00332430"
effective: "2024-11-18"
recorded: "2024-11-18T14:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
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
    "problem_id": "PL-9022",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2017-05-01", "precision": "month" },
    "visit_id": "V-2024-111887"
  }
}
```
