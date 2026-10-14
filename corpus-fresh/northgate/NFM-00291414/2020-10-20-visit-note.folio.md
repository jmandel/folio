---
folio: "0.1"
id: "01EN3F82M0F2SGYN5QXWPH7YS6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00291414"
effective: "2020-10-20T08:40:00-05:00"
recorded: "2020-10-20T12:00:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Pt reports dry cough on lisinopril.
Lisinopril stopped today (dry cough), entered as intolerance. Losartan 50 mg daily started today for the ACE inhibitor cough.
BP 134/80, pulse 70, wt 163 lb.
eGFR 69, K 4.3, A1c 6.8% today.
Recheck BP and K at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-102062",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-102062",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-102062",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2020-102062",
    "rank": 3,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
