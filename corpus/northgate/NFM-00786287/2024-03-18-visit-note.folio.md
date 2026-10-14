---
folio: "0.1"
id: "01HS9TCVM0FPW6MH1GFMF4Z878"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00786287"
effective: "2024-03-18T14:20:00-05:00"
recorded: "2024-03-18T17:20:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
F/u. Pt feels well, no new concerns today.

BP 118/65, pulse 64, wt 215 lb.

Wt steady, BP at goal. Continue current plan.

RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-031859",
    "visit_type": "office",
    "reason": "Follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-031859",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
