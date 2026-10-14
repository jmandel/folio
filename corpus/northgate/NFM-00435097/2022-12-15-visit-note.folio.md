---
folio: "0.1"
id: "01GMBJ3XQ07YC7J1CMMC8J65E0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00435097"
effective: "2022-12-15T09:30:00-06:00"
recorded: "2022-12-15T12:53:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 154/86, repeat 147/84, pulse 66, wt 234 lb.
Today: eGFR 99, K 4.8, UACR 69 mg/g, A1c 6.9%, LDL 90 mg/dL.
BP above goal, amlodipine started 5 mg daily today.
Pt counseled on ankle swelling. RTC 2 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-121545",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-121545",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-121545",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2022-121545",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
