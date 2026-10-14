---
folio: "0.1"
id: "01GM9JFSF0BPH827H49A8FR0YM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00140287"
effective: "2022-12-14T12:30:00-06:00"
recorded: "2022-12-14T18:21:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 141/81, repeat 139/78, pulse 80, wt 159 lb.
Labs today: eGFR 40, K 4.6, A1c 6.9%, LDL 119.
BP above goal, so amlodipine started, 5 mg daily today.
Pt agrees. RTC 3 mo for BP.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-121416",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-121416",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-121416",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-121416",
    "rank": 3,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2022-121416",
    "rank": 4,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
