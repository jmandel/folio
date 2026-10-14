---
folio: "0.1"
id: "01JH1NFQZ0HXT9M6NY68CJ9DKA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00416988"
effective: "2025-01-07T12:15:00-06:00"
recorded: "2025-01-07T18:37:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well.
BP 128/75, pulse 69, wt 205 lb.
Today: eGFR 92, K 4.6, UACR 9 mg/g, A1c 6.6%, LDL 105 mg/dL.
A1c above goal: dapagliflozin started 10 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-010773",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-010773",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-010773",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
