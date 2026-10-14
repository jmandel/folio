---
folio: "0.1"
id: "01GCJ15QP06ZAHEVDZAE5050MV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00377621"
effective: "2022-09-09T12:20:00-05:00"
recorded: "2022-09-09T16:06:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new symptoms.
BP 124/71, pulse 87, wt 135 lb.
Labs today: A1c 7.9%, eGFR 59, K 3.9.
Will keep following A1c and eGFR.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-090997",
    "visit_type": "office",
    "reason": "Chronic care visit"
  }
}
```
