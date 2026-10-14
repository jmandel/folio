---
folio: "0.1"
id: "01HBHME460VPV06FJ2A1TX8Q41"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00276077"
effective: "2023-09-29T13:15:00-05:00"
recorded: "2023-09-29T18:30:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam.

<ref id="sick_day">Sick-day rules reviewed: hold the SGLT2 inhibitor, metformin and ARB/ACE inhibitor when unable to eat or drink.</ref>

empagliflozin: started 10 mg daily today (A1c above goal)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-092913",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-092913",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-092913",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2023-092913",
    "rank": 3,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2023-092913",
    "rank": 4,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  }
}
```
