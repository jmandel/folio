---
folio: "0.1"
id: "01J7H9RKD0WH68C3T8D0ZMH2WY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00831906"
effective: "2024-09-11T10:10:00-05:00"
recorded: "2024-09-11T14:43:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam.
BP 136/74, pulse 88, wt 127 lb.
Today: eGFR 48, K 4.4, UACR 76 mg/g, A1c 8.1%, LDL 100.
Dulaglutide started 0.5 mg weekly today (A1c 8.1). Injection teaching done.
RTC 3-6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-091113",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-091113",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-091113",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-091113",
    "rank": 3,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2024-091113",
    "rank": 4,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
