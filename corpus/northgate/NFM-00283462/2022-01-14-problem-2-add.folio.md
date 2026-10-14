---
folio: "0.1"
id: "01FSCJWSE0XG4SFF1J4KVA1VZB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00283462"
effective: "2022-01-14"
recorded: "2022-01-14T09:22:00-06:00"
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
    "problem_id": "PL-16761",
    "action": "add",
    "description": "Hyperlipidemia",
    "icd10cm": "E78.5",
    "snomed": "55822004",
    "onset": { "date": "2017-01-01", "precision": "year" },
    "visit_id": "V-2022-011494"
  }
}
```
