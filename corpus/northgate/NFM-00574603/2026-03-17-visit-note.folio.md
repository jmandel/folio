---
folio: "0.1"
id: "01KKYCGVR0583MCAS53Z71FH4J"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00574603"
effective: "2026-03-17T09:45:00-05:00"
recorded: "2026-03-17T12:12:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. A1c up, discussed with pt.
BP 116/74, pulse 82, wt 188 lb.
Labs 3/13: eGFR 95, K 4.2, A1c 8.6%.
Dapagliflozin started 10 mg daily today (A1c 8.6).
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-031794",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  }
}
```
