---
folio: "0.1"
id: "01FF1ER87029JC0PNSRXTM4JAD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00484559"
effective: "2021-09-07T14:00:00-05:00"
recorded: "2021-09-07T20:01:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 124/72, pulse 85, wt 185 lb.
Labs 9/3: eGFR 57, K 4.2, A1c 7.4%. CKD stage 3a on problem list.
Dry cough on lisinopril. Lisinopril stopped today (dry cough), logged as lisinopril intolerance: dry cough.
Losartan started 50 mg daily today (ACE inhibitor cough).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-090791",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-090791",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-090791",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2021-090791",
    "rank": 3,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  }
}
```
