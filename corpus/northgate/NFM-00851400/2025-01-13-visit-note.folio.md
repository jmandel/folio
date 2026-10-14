---
folio: "0.1"
id: "01JHGH3F707RXK1W4ZWVSRGAV9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00851400"
effective: "2025-01-13T09:30:00-06:00"
recorded: "2025-01-13T13:09:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 146/85, pulse 64, wt 265 lb.
Labs today: eGFR 63, K 4.1, UACR 279 mg/g, A1c 7.3%, LDL 89 mg/dL.
BP above goal, amlodipine started 5 mg daily today.
Pt agrees with plan. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-011389",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-011389",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-011389",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
