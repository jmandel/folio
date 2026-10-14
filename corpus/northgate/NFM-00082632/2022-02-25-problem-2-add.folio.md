---
folio: "0.1"
id: "01FWRTQP30PS43849P7TV43F3F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00082632"
effective: "2022-02-25"
recorded: "2022-02-25T10:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 DM, onset 2013 per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-14992",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2013-01-01", "precision": "year" },
    "visit_id": "V-2022-022516"
  }
}
```
