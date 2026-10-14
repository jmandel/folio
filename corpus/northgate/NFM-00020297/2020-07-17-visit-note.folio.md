---
folio: "0.1"
id: "01EDFDXCT06A0WRSNNJ7H3808S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00020297"
effective: "2020-07-17T12:15:00-05:00"
recorded: "2020-07-17T17:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam.

dulaglutide: started 0.5 mg weekly today (A1c 8.1)

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-071783",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-071783",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-071783",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2020-071783",
    "rank": 3,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2020-071783",
    "rank": 4,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_5": {
    "type": "billing_dx",
    "visit_id": "V-2020-071783",
    "rank": 5,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
