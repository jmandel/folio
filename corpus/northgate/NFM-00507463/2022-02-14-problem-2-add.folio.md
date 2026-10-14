---
folio: "0.1"
id: "01FVWR2Z80GXNHB8DDDKDTPGJ1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00507463"
effective: "2022-02-14"
recorded: "2022-02-14T12:32:00-06:00"
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
    "problem_id": "PL-10180",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2018-11-01", "precision": "month" },
    "visit_id": "V-2022-021445"
  }
}
```
