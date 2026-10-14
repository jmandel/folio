---
folio: "0.1"
id: "01K7JDSKH01NR0N88D9Q14N9KT"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00474892"
effective: "2025-10-14T13:00:00-05:00"
recorded: "2025-10-14T17:35:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well.
BP 123/70, pulse 80, wt 142 lb.
Labs today: eGFR 48, K 4.2, UACR 15 mg/g, A1c 7.5%.
Reviewed results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-101474",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-101474",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-101474",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2025-101474",
    "rank": 3,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
