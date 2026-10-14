---
folio: "0.1"
id: "01G3BRR1T0N0GB40A8A20QGKD0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00004878"
effective: "2022-05-18"
recorded: "2022-05-18T09:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">DM2 dx'd 4/2016, per pt. Added at first visit here.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19789",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2016-04-02", "precision": "day" },
    "visit_id": "V-2022-051834"
  }
}
```
