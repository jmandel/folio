---
folio: "0.1"
id: "01K5023J70SD0S7NF1NNJGCQF4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00482130"
effective: "2025-09-12T12:20:00-05:00"
recorded: "2025-09-12T17:53:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints.
BP 146/87, repeat 140/86, pulse 63, wt 165 lb.
Labs 9/10: eGFR 49, K 4.8, A1c 7.4%.
Chlorthalidone: started 12.5 mg daily today (BP above goal). Pt to report dizziness or cramps.
RTC 6 wk for BP and labs.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-091224",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-091224",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-091224",
    "rank": 2,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2025-091224",
    "rank": 3,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
