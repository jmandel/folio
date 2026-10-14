---
folio: "0.1"
id: "01K1VCK6305NVB9B7KPFPSSP0V"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00259527"
effective: "2025-08-04T09:20:00-05:00"
recorded: "2025-08-04T15:33:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints.

BP 140/83, pulse 64, wt 228 lb. Labs 8/2: eGFR 59, K 4.4, UACR 381 mg/g, A1c 7.3%, LDL 45 mg/dL.

CKD 3a on problem list. Went over results with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-080491",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-080491",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-080491",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2025-080491",
    "rank": 3,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2025-080491",
    "rank": 4,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_5": {
    "type": "billing_dx",
    "visit_id": "V-2025-080491",
    "rank": 5,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
