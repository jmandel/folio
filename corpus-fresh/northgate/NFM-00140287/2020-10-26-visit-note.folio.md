---
folio: "0.1"
id: "01ENKMP9X00C71PPJBNTWD4S51"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00140287"
effective: "2020-10-26T14:45:00-05:00"
recorded: "2020-10-26T18:43:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 143/88, pulse 65, wt 161 lb.
A1c 6.6% today. eGFR 44, K 4.4, UACR 219 mg/g.
BP a little high in the office. Pt feels well, no new complaints.
Continue current plan. RTC 4-6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-102626",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-102626",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-102626",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2020-102626",
    "rank": 3,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
