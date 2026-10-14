---
folio: "0.1"
id: "01FA0WRBM01GJQ1XHX4FK6XEY8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00591713"
effective: "2021-07-07T09:15:00-05:00"
recorded: "2021-07-07T11:28:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. Feels well, no new concerns today.

BP 124/67, pulse 85, wt 168 lb.
Labs 7/1: eGFR 69, K 4.2. Reviewed with pt.

RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-070761",
    "visit_type": "office",
    "reason": "Follow-up"
  }
}
```
