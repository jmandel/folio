---
folio: "0.1"
id: "01JA5R7FM0V8P7A89VEW5NMR2E"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00864169"
effective: "2024-10-14"
recorded: "2024-10-14T09:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">HFrEF since 2022, per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-12089",
    "action": "add",
    "description": "Heart failure with reduced ejection fraction",
    "icd10cm": "I50.22",
    "snomed": "703272007",
    "onset": { "date": "2022-01-01", "precision": "year" },
    "visit_id": "V-2024-101451"
  }
}
```
