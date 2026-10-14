---
folio: "0.1"
id: "01HV9YE4P01Y2HDFKPG8FDEG3C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00951784"
effective: "2024-04-12"
recorded: "2024-04-12T15:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">HFrEF, onset 6/12/2023 per pt.</ref> Added at first visit.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-10615",
    "action": "add",
    "description": "Heart failure with reduced ejection fraction",
    "icd10cm": "I50.22",
    "snomed": "703272007",
    "onset": { "date": "2023-06-12", "precision": "day" },
    "visit_id": "V-2024-041233"
  }
}
```
