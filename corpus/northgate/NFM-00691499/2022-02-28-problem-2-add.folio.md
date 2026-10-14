---
folio: "0.1"
id: "01FX0ZYEJ0016GY0AT3KFC99JN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00691499"
effective: "2022-02-28"
recorded: "2022-02-28T14:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
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
    "problem_id": "PL-10407",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2017-01-01", "precision": "year" },
    "visit_id": "V-2022-022814"
  }
}
```
