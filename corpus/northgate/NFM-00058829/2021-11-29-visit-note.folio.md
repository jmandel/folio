---
folio: "0.1"
id: "01FNPXED406NEK1Y2BRM30DCYB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00058829"
effective: "2021-11-29T12:10:00-06:00"
recorded: "2021-11-29T16:36:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 143/85, repeat 139/84, pulse 63, wt 225 lb.
Labs 11/23: eGFR 71, K 4.1, A1c 6.8%, LDL 134 mg/dL.
BP still above goal, amlodipine started 5 mg daily today.
Pt agrees with plan.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-112985",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-112985",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-112985",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
