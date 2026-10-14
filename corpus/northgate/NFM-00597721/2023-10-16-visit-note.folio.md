---
folio: "0.1"
id: "01HCWQNVY02EV1PBM563P841HB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00597721"
effective: "2023-10-16T10:30:00-05:00"
recorded: "2023-10-16T12:14:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well.
BP 135/76, pulse 74, wt 277 lb.
eGFR 99 today, K 4.5.
Reviewed diet, activity.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-101611",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-101611",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
