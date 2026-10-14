---
folio: "0.1"
id: "01GF1N4RS0PTR0Z0BPYMQ7Z3M5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00096311"
effective: "2022-10-10T08:10:00-05:00"
recorded: "2022-10-10T14:15:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 131/81, pulse 74, wt 171 lb.

Labs today: eGFR 62, K 4.7, A1c 7.6%.

A1c improved after last adjustment. Pt doing well.

RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-101079",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-101079",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-101079",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
