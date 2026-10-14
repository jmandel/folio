---
folio: "0.1"
id: "01M1CP1VR0D76FNG7133XDCXTC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00396807"
effective: "2026-08-31T13:20:00-05:00"
recorded: "2026-08-31T14:52:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No new complaints.
BP 131/77, pulse 86, wt 223 lb.
Labs today: eGFR 40, K 5, UACR 456 mg/g, A1c 7.6%.
Kidney function and urine albumin worse than before, went over with pt. Will repeat labs at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-083149",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-083149",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-083149",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2026-083149",
    "rank": 3,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2026-083149",
    "rank": 4,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
