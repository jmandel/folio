---
folio: "0.1"
id: "01GYDT8Y50BR8ABCMVKV6QWRWP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00347581"
effective: "2023-04-19T12:45:00-05:00"
recorded: "2023-04-19T17:31:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing well, no complaints.

BP 139/77, pulse 77, wt 215 lb.
Today: eGFR 65, K 4.1, UACR 27 mg/g, A1c 7%.

A1c improved. Pt pleased with the numbers. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-041957",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-041957",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-041957",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
