---
folio: "0.1"
id: "01KHM237Y0JX2455T0XV5T54R4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759365"
effective: "2026-02-16T12:45:00-06:00"
recorded: "2026-02-16T14:26:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 126/79, pulse 87, wt 195 lb.
Labs today: eGFR 50, K 4.2, UACR 755 mg/g, A1c 7.8%.
BP at goal. Kidney function and UACR reviewed with pt.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-021619",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-021619",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-021619",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2026-021619",
    "rank": 3,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  },
  "dx_4": {
    "type": "billing_dx",
    "visit_id": "V-2026-021619",
    "rank": 4,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
