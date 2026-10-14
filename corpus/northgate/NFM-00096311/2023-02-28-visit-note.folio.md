---
folio: "0.1"
id: "01GTD2QZQ0DSHNTN61NN47WE8Z"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00096311"
effective: "2023-02-28T12:15:00-06:00"
recorded: "2023-02-28T16:37:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 130/74, pulse 78, wt 174 lb.

Labs 2/25: eGFR 61, K 4.3, A1c 7.5%.

Stable. No new complaints. Continue current plan.

RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-022841",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-022841",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-022841",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
