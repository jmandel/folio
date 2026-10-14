---
folio: "0.1"
id: "01GX6R0CQ0P57QP0E9DZ6NH7MP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00147899"
effective: "2023-04-04T10:20:00-05:00"
recorded: "2023-04-04T13:21:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing OK, no new complaints.
BP 140/83, repeat 136/80, pulse 71, wt 239 lb.
Continue current meds. Diet and exercise reviewed.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-040459",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-040459",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
