---
folio: "0.1"
id: "01JDTEAEJ01SQMMTZEEMSB93YX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00823780"
effective: "2024-11-28T11:15:00-06:00"
recorded: "2024-11-28T16:30:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 153/93, repeat 148/91, pulse 84, wt 165 lb.

Labs today: eGFR 47, K 4.7, UACR 227 mg/g, A1c 7.3%. CKD stage 3a added to problem list.

BP above goal, lisinopril dose changed to 20 mg daily today.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-112834",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-112834",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-112834",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2024-112834",
    "rank": 3,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2024-112834",
    "rank": 4,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_5": {
    "type": "billing_dx",
    "visit_id": "V-2024-112834",
    "rank": 5,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
