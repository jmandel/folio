---
folio: "0.1"
id: "01KQSZFPJ0YKPTDN8MSJVF38JZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00731552"
effective: "2026-05-04T10:10:00-05:00"
recorded: "2026-05-04T12:10:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Visit for kidney function. eGFR 41 and UACR 320 mg/g on 2/9, CKD 3a.
Empagliflozin 10 mg daily was stopped after euglycemic DKA.
BP 138/84, pulse 74, wt 189 lb.
Referral to nephrology placed today. Pt agrees.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-050466",
    "visit_type": "office",
    "reason": "Kidney function, referral"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-050466",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-050466",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2026-050466",
    "rank": 3,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
