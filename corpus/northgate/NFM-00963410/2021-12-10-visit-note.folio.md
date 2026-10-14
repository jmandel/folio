---
folio: "0.1"
id: "01FPKMVSG0TJF8H2R2F4HZNJKF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00963410"
effective: "2021-12-10T15:15:00-06:00"
recorded: "2021-12-10T20:24:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 139/84, pulse 71, wt 174 lb.
Labs 12/8: eGFR 62, K 4.2, LDL 73 mg/dL.
Reviewed results with pt. No new concerns.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-121031",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-121031",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-121031",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
