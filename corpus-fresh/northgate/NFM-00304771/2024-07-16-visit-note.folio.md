---
folio: "0.1"
id: "01J2YPDXM099H21EZ6C53BZHJ3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00304771"
effective: "2024-07-16T13:30:00-05:00"
recorded: "2024-07-16T16:16:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 150/87, repeat 148/84, pulse 75, wt 221 lb.
Labs today: eGFR 63, K 4, UACR 67 mg/g, A1c 6.6%.
Chlorthalidone: started 12.5 mg daily today (BP above goal).
Recheck BMP in 2-4 wk. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-071684",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-071684",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-071684",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
