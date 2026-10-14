---
folio: "0.1"
id: "01HZ0G8QG0N0XK2MQ8EZKXTYC7"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00147899"
effective: "2024-05-28T14:30:00-05:00"
recorded: "2024-05-28T16:04:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Pt doing well, no complaints.
BP 129/77, pulse 66, wt 237 lb.
No med changes today.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-052837",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-052837",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
