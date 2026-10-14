---
folio: "0.1"
id: "01HY0XXSN03NPZYYVGYWFNQGR6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00458711"
effective: "2024-05-16"
recorded: "2024-05-16T09:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Type 2 diabetes mellitus.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12717",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2018-01-01", "precision": "year" },
    "visit_id": "V-2024-051663"
  }
}
```
