---
folio: "0.1"
id: "01HA2KHCJ0GB5J6NCP490SYY79"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00731552"
effective: "2023-09-11T09:55:00-05:00"
recorded: "2023-09-11T12:10:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 and HTN f/u. Doing well, no new symptoms.
BP 132/80, pulse 74, wt 186 lb.
Home sugars reported as steady. Continue current plan.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-091139",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-091139",
    "rank": 1,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-091139",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
