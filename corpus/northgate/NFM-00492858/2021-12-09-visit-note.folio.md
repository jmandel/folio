---
folio: "0.1"
id: "01FPG4N350MX70349Z9DEZBE65"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00492858"
effective: "2021-12-09T08:15:00-06:00"
recorded: "2021-12-09T11:43:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.
BP 145/93, pulse 79, wt 187 lb.
Labs today: eGFR 83, K 4.1, UACR 8 mg/g, A1c 7.1%.
BP above goal today. Will recheck at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-120964",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-120964",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-120964",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2021-120964",
    "rank": 3,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
