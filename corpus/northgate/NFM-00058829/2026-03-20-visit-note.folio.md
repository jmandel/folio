---
folio: "0.1"
id: "01KM6YFYM0Z3ZJ4NP6YBCV3JDB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00058829"
effective: "2026-03-20T15:50:00-05:00"
recorded: "2026-03-20T20:00:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No complaints.
BP 129/71, pulse 81, wt 228 lb.
Today: eGFR 67, K 4.4, A1c 6.9%, LDL 145 mg/dL.
Results reviewed with pt, BP at goal.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-032053",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-032053",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-032053",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
