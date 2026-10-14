---
folio: "0.1"
id: "01HJ748WZ0TV09WFNP6H7BHN7C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00621637"
effective: "2023-12-21T13:15:00-06:00"
recorded: "2023-12-21T15:25:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well, no new sx.

BP 138/86, pulse 68, wt 194 lb.

Labs today: eGFR 63, K 4.2, UACR 103 mg/g, A1c 7.2%, LDL 154.

A1c improved. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-122143",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-122143",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-122143",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
