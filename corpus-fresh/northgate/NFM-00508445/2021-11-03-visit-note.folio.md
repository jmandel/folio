---
folio: "0.1"
id: "01FKKEVPG0DAHRE9NXATMCHZC8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00508445"
effective: "2021-11-03T09:10:00-05:00"
recorded: "2021-11-03T12:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new concerns.
BP 130/81, pulse 66, wt 249 lb.
Labs 10/30: eGFR 59, K 4.3, LDL 138 mg/dL.
CKD stage 3a on problem list, discussed with pt.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-110349",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-110349",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-110349",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2021-110349",
    "rank": 3,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
