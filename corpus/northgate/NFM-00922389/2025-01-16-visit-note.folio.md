---
folio: "0.1"
id: "01JHS2X2A08Q3V7674R11DR2RD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00922389"
effective: "2025-01-16T15:10:00-06:00"
recorded: "2025-01-16T20:54:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No acute complaints.

BP 140/84, pulse 80, wt 187 lb. Labs 1/12: eGFR 49, K 4.4, UACR 454 mg/g, A1c 7.8%.

A1c and UACR trending up, discussed with pt. Diet and glucose log reviewed.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-011682",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-011682",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-011682",
    "rank": 2,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
