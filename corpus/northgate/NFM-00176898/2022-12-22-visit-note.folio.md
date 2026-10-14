---
folio: "0.1"
id: "01GMY537H0QM062PN8VNQC70TC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00176898"
effective: "2022-12-22T14:40:00-06:00"
recorded: "2022-12-22T18:11:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 141/89, repeat 136/89, pulse 80, wt 184 lb.
Labs 12/19: eGFR 44, K 4.3, UACR 242 mg/g, A1c 6.8%. CKD stage 3b on problem list.
Dry cough on lisinopril, so lisinopril stopped today. Logged as intolerance: dry cough.
Losartan started 50 mg daily today for the ACE inhibitor cough.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-122291",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-122291",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-122291",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-122291",
    "rank": 3,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  }
}
```
