---
folio: "0.1"
id: "01GPES18S057DHRMD1X9GW47H8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00387375"
effective: "2023-01-10T09:30:00-06:00"
recorded: "2023-01-10T15:23:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. Doing well, no new symptoms.
BP 119/68, pulse 82, wt 180 lb.
Labs 1/5: eGFR 81, K 4.2.
Labs reviewed with pt.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-011029",
    "visit_type": "office",
    "reason": "Follow-up"
  }
}
```
