---
folio: "0.1"
id: "01KWYX3BX0VMGTNZ2MJQAGK10H"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00937830"
effective: "2026-07-07T08:50:00-05:00"
recorded: "2026-07-07T13:23:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. A1c 8.1, still above goal.

BP 124/76, pulse 65, wt 209 lb.

Semaglutide started today, 0.5 mg weekly. Reviewed GI side effects and injection technique with pt.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-070788",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-070788",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
