---
folio: "0.1"
id: "01ECB0X4201RKZC3WJ84R0FHYS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00924672"
effective: "2020-07-03"
recorded: "2020-07-03T14:02:00-05:00"
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
    "problem_id": "PL-18913",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2012-01-01", "precision": "year" },
    "visit_id": "V-2020-070344"
  }
}
```
