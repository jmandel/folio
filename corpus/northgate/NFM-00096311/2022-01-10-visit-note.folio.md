---
folio: "0.1"
id: "01FS32WCV0A1RDAXFNXAT5RBQ9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00096311"
effective: "2022-01-10T13:00:00-06:00"
recorded: "2022-01-10T16:49:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 138/81, pulse 86, wt 173 lb.

Labs 1/6: eGFR 64, K 4.7, A1c 7.9%.

Pt feels well, no hypoglycemia reported. Continue current plan.

RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-011092",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-011092",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-011092",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
