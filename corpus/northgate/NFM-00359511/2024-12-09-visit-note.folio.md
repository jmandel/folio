---
folio: "0.1"
id: "01JEPBW6J0928YQRHJ1PAQEF9A"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00359511"
effective: "2024-12-09T11:00:00-06:00"
recorded: "2024-12-09T12:46:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam.

insulin glargine: started 10 units at bedtime today (A1c 6.6)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-120926",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-120926",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-120926",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-120926",
    "rank": 3,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2024-120926",
    "rank": 4,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
