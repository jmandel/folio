---
folio: "0.1"
id: "01E1CC8EN07V2S6DNPMVK93R90"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785765"
effective: "2020-02-18"
recorded: "2020-02-18T08:47:00-06:00"
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
    "problem_id": "PL-18221",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2011-05-01", "precision": "month" },
    "visit_id": "V-2020-021894"
  }
}
```
