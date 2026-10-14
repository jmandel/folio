---
folio: "0.1"
id: "01KEJ18TJ00CTT0FH2QW9ME8BV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00937830"
effective: "2026-01-09T10:20:00-06:00"
recorded: "2026-01-09T12:46:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well, no new complaints.

BP 124/78, pulse 77, wt 207 lb.

Reviewed home readings. Continue current plan.

RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-010917",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  }
}
```
