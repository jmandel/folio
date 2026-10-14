---
folio: "0.1"
id: "01K0A6D1E0YFRRQVYZ5M9C2X2C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00143452"
effective: "2025-07-16T11:20:00-05:00"
recorded: "2025-07-16T13:02:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well, no new complaints.

BP 126/81, pulse 78, wt 204 lb.

Labs 7/13: eGFR 83, K 4.1, LDL 103 mg/dL, A1c 8.8%.

A1c 8.8, started insulin glargine 10 units at bedtime today. Taught pt injection and low sugar symptoms.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-071636",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-071636",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-071636",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2025-071636",
    "rank": 3,
    "icd10cm": "I50.22",
    "display": "Chronic systolic (congestive) heart failure"
  }
}
```
