---
folio: "0.1"
id: "01DMXCC280033ZY87H0MSCBF78"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00206105"
effective: "2019-09-16"
recorded: "2019-09-16T10:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">DM2, onset 2011 per pt.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18314",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "onset": { "date": "2011-01-01", "precision": "year" },
    "visit_id": "V-2019-091685"
  }
}
```
