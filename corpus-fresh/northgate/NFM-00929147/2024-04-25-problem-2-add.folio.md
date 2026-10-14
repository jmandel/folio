---
folio: "0.1"
id: "01HWAV9HP0Z6YWA7BMZ1NS3W24"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00929147"
effective: "2024-04-25"
recorded: "2024-04-25T09:42:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">DM2 since about 11/2018, history per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-15369",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2018-11-04", "precision": "day" },
    "visit_id": "V-2024-042593"
  }
}
```
