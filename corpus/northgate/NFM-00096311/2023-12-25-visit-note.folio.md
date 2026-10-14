---
folio: "0.1"
id: "01HJH3X5N0V9D4Y0M1B6B6PB81"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00096311"
effective: "2023-12-25T09:40:00-06:00"
recorded: "2023-12-25T12:31:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. BP 139/82, pulse 63, wt 175 lb.

Labs 12/23: eGFR 60, K 4.2, A1c 7.8%, LDL 78 mg/dL.

Pt well, no complaints. Diet and exercise reviewed.

RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-122598",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-122598",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-122598",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
