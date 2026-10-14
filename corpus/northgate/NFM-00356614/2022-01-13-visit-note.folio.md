---
folio: "0.1"
id: "01FSAF2ZV0GGX2BK4X4PPF1Y0Z"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00356614"
effective: "2022-01-13T11:50:00-06:00"
recorded: "2022-01-13T13:37:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. No complaints.
BP 141/79, repeat 139/78, pulse 84, wt 239 lb.
Labs 1/11: eGFR 59, K 4.6, UACR 228 mg/g, A1c 7.7%.
Chlorthalidone started 12.5 mg daily today (BP above goal).
BMP in a few weeks. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-011336",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-011336",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-011336",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
