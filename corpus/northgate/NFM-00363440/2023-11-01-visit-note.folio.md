---
folio: "0.1"
id: "01HE6GB9Y0N1EF22WZR4TNTZ9Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00363440"
effective: "2023-11-01T14:30:00-05:00"
recorded: "2023-11-01T17:34:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well, no new concerns.
BP 134/77, pulse 64, wt 172 lb.
Labs 10/30: eGFR 94, K 4.6, LDL 90 mg/dL.
Counseled on diet and exercise.
RTC 6–9 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-110183",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-110183",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-110183",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
