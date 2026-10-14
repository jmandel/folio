---
folio: "0.1"
id: "01K5T10A20CFJ7EKMEFXGYE70X"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00007594"
effective: "2025-09-22T15:00:00-05:00"
recorded: "2025-09-22T19:54:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. Doing well, no new symptoms.
BP 135/82, pulse 67, wt 209 lb.
eGFR 68, K 4.1 today.
Reviewed results with pt, encouraged diet and activity.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-092232",
    "visit_type": "office",
    "reason": "Follow-up"
  }
}
```
