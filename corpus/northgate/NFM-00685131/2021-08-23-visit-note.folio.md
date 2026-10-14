---
folio: "0.1"
id: "01FDTFJJV0VEKVB35EVYVVH29F"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00685131"
effective: "2021-08-23T11:20:00-05:00"
recorded: "2021-08-23T16:45:00-05:00"
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

BP 149/90, repeat 147/88, pulse 77, wt 227 lb.
eGFR 60 and K 4.8 today.

BP above goal, chlorthalidone started 12.5 mg daily today. Pt agrees with plan.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-082353",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-082353",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
