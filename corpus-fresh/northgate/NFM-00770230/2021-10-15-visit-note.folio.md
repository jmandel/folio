---
folio: "0.1"
id: "01FJ391XX0SZ3CRQW9VFBV5ZSN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00770230"
effective: "2021-10-15T14:30:00-05:00"
recorded: "2021-10-15T19:47:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well.
BP 115/67, pulse 74, wt 170 lb.
Labs 10/13: eGFR 66, K 4.3, UACR 256 mg/g, A1c 7.3%, LDL 132 mg/dL.
Continue current plan. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-101555",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-101555",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-101555",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
