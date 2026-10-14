---
folio: "0.1"
id: "01FQCPT0X0GXC47BRARP1WDRD8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00920167"
effective: "2021-12-20T10:40:00-06:00"
recorded: "2021-12-20T13:59:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 139/83, pulse 73, wt 132 lb.
Labs 12/14: eGFR 67, K 4.3, A1c 6.8%, LDL 43.
A1c back down, kidney function stable. Pt doing well.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-122062",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-122062",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-122062",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
