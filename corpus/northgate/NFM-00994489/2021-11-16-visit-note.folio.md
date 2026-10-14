---
folio: "0.1"
id: "01FMNJQWE0Y52QYZ5XKPHHG2BY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00994489"
effective: "2021-11-16T14:50:00-06:00"
recorded: "2021-11-16T17:54:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.
BP 126/77, pulse 69, wt 216 lb.
eGFR 76 today, K 4.3.
BP at goal. Continue current plan.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-111621",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-111621",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
