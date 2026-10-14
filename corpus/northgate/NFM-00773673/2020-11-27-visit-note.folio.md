---
folio: "0.1"
id: "01ER5T13A0DZGKSGK6YQKM6HAE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00773673"
effective: "2020-11-27T11:20:00-06:00"
recorded: "2020-11-27T15:34:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Records reviewed with pt.
BP 138/76, pulse 72, wt 239 lb.
Labs from 11/22: eGFR 93, K 4.1.
Discussed diet and activity.
RTC 1 yr, sooner prn.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-112789",
    "visit_type": "office",
    "reason": "New patient, establish care"
  }
}
```
