---
folio: "0.1"
id: "01KC51DE90A0YE13ZNPRCM0RGY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00922389"
effective: "2025-12-10T09:00:00-06:00"
recorded: "2025-12-10T15:07:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.

BP 134/85, pulse 73, wt 188 lb. Labs today: eGFR 47, K 4.5, UACR 481 mg/g, A1c 7.4%.

UACR remains elevated, reviewed with pt. Continue current plan.

RTC 3-4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-121041",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-121041",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-121041",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2025-121041",
    "rank": 3,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
