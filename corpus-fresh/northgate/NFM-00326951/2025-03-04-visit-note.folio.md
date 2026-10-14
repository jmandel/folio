---
folio: "0.1"
id: "01JNHE6180Y4GH8PHW14596307"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00326951"
effective: "2025-03-04T12:15:00-06:00"
recorded: "2025-03-04T14:40:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feeling well. BP 134/81, pulse 70, wt 191 lb.

Home readings reviewed with pt. Diet and exercise discussed.

RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-030463",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  }
}
```
