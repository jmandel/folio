---
folio: "0.1"
id: "01JBYEP7E0R3SKEPCCPG5A15AJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00978964"
effective: "2024-11-05"
recorded: "2024-11-05T09:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">DM2 since 4/2016 per pt. Added to problem list at first visit here.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-9529",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2016-04-01", "precision": "month" },
    "visit_id": "V-2024-110522"
  }
}
```
