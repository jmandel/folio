---
folio: "0.1"
id: "01KYX3B3Q01FX412FE8F9XAEZZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759365"
effective: "2026-07-31T12:45:00-05:00"
recorded: "2026-07-31T17:05:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 127/77, pulse 78, wt 193 lb.
Labs 7/28: eGFR 46, K 4.6, UACR 752 mg/g, A1c 7.8%.
Metformin dose changed to 500 mg twice daily today (eGFR 45).
Pt understands. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-073177",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-073177",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-073177",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2026-073177",
    "rank": 3,
    "icd10cm": "E11.22",
    "display": "Type 2 diabetes mellitus with diabetic chronic kidney disease"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2026-073177",
    "rank": 4,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_5": {
    "type": "billing_dx",
    "visit_id": "V-2026-073177",
    "rank": 5,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
