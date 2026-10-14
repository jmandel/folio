---
folio: "0.1"
id: "01GQ0WVB80WSH9JBTMKWSS95TQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00120078"
effective: "2023-01-17T13:20:00-06:00"
recorded: "2023-01-17T16:16:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u visit. Feels well, no new complaints.
BP 122/74, pulse 76, wt 207 lb.
Labs 1/15: eGFR 68, K 4.2.
Stable, continue current plan.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-011718",
    "visit_type": "office",
    "reason": "Follow-up"
  }
}
```
