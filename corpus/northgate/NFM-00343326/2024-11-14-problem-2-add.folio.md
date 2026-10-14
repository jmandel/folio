---
folio: "0.1"
id: "01JCP2JEW0ZP9GG819Q46S87JV"
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
<ref id="prob_1">Type 2 diabetes mellitus.</ref>

```json payload
{
  "prob_1": {
    "type": "problem_event",
    "problem_id": "PL-18013",
    "action": "add",
    "description": "Type 2 diabetes mellitus",
    "icd10cm": "E11.9",
    "snomed": "44054006",
    "onset": { "date": "2017-01-01", "precision": "year" },
    "visit_id": "V-2024-111488"
  }
}
```
