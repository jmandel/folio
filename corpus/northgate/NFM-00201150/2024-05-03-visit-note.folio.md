---
folio: "0.1"
id: "01HX0GME50ZZ0WE6619AAC2X4Z"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00201150"
effective: "2024-05-03T13:20:00-05:00"
recorded: "2024-05-03T19:39:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit.

insulin glargine: started 10 units at bedtime today (A1c 8.1)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-050398",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-050398",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-050398",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
