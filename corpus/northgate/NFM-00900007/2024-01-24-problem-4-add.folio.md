---
folio: "0.1"
id: "01HMYPRF20YH2BH3KSFYM0HW70"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00900007"
effective: "2024-01-24"
recorded: "2024-01-24T15:42:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">HFrEF, onset 5/2019 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-13203",
    "action": "add",
    "description": "Heart failure with reduced ejection fraction",
    "icd10cm": "I50.22",
    "snomed": "703272007",
    "onset": { "date": "2019-05-01", "precision": "month" },
    "visit_id": "V-2024-012489"
  }
}
```
