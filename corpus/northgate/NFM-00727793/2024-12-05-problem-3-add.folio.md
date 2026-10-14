---
folio: "0.1"
id: "01JEC422Z0BSDX53FDCY7FNPEH"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00727793"
effective: "2024-12-05"
recorded: "2024-12-05T13:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Heart failure with reduced ejection fraction.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12698",
    "action": "add",
    "description": "Heart failure with reduced ejection fraction",
    "icd10cm": "I50.22",
    "snomed": "703272007",
    "onset": { "date": "2022-12-01", "precision": "month" },
    "visit_id": "V-2024-120578"
  }
}
```
