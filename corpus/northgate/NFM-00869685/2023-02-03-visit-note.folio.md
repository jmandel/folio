---
folio: "0.1"
id: "01GRCSNJD03VFYFPMF5MYQBTFM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00869685"
effective: "2023-02-03T14:45:00-06:00"
recorded: "2023-02-03T17:27:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 130/79, pulse 67, wt 205 lb.
Labs 1/29: eGFR 97, K 4.1, LDL 76 mg/dL.
BP at goal, labs reviewed with pt. No changes today.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-020386",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-020386",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-020386",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
