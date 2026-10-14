---
folio: "0.1"
id: "01JCP2JEW0GVJ3FMMQYRDRCMRY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00343326"
effective: "2024-11-14"
recorded: "2024-11-14T13:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
<ref id="prob_1">Primary OA of knee, onset 6/2017 per pt.</ref> Added at first visit here.

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-19247",
    "action": "add",
    "description": "Primary osteoarthritis of knee",
    "icd10cm": "M17.9",
    "snomed": "239873007",
    "onset": { "date": "2017-06-01", "precision": "month" },
    "visit_id": "V-2024-111488"
  }
}
```
