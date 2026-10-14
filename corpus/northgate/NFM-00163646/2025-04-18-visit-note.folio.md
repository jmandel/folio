---
folio: "0.1"
id: "01JS53DZC0Z6QFSP6YP2R95FG2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00163646"
effective: "2025-04-18T09:10:00-05:00"
recorded: "2025-04-18T13:44:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing okay, no new symptoms.

BP 128/78, pulse 81, wt 163 lb.
Labs 4/14: eGFR 95, A1c 7.8%, LDL 88 mg/dL.

Went over results with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-041868",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  }
}
```
