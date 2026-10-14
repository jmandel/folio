---
folio: "0.1"
id: "01HKWZJRY0QE5EP1DBEZRHP9TX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00577826"
effective: "2024-01-11"
recorded: "2024-01-11T13:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">HFrEF, onset 2023 per pt.</ref> Added at first visit here, history per pt.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13093",
    "action": "add",
    "description": "Heart failure with reduced ejection fraction",
    "icd10cm": "I50.22",
    "snomed": "703272007",
    "onset": { "date": "2023-01-01", "precision": "year" },
    "visit_id": "V-2024-011193"
  }
}
```
