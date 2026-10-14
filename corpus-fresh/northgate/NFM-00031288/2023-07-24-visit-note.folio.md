---
folio: "0.1"
id: "01H64RZWZ0BCVG620TBDZ43MT4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00031288"
effective: "2023-07-24T10:50:00-05:00"
recorded: "2023-07-24T15:21:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 154/98, pulse 64, wt 185 lb.
eGFR 36, K 4.8, UACR 18 mg/g, A1c 7.7% today.
Started dapagliflozin 10 mg daily today for CKD + DM, cardiorenal benefit.
Recheck BP at next visit. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-072429",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-072429",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-072429",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2023-072429",
    "rank": 3,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2023-072429",
    "rank": 4,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_5": {
    "type": "billing_dx",
    "visit_id": "V-2023-072429",
    "rank": 5,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
