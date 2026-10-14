---
folio: "0.1"
id: "01FB5BFJ60V2J7Z3Q3JYK010PD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00869685"
effective: "2021-07-21T10:30:00-05:00"
recorded: "2021-07-21T15:18:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 142/84, repeat 136/83, pulse 74, wt 203 lb.
Labs today: eGFR 97, K 4.6, LDL 91 mg/dL.
BP still above goal, so chlorthalidone started 12.5 mg daily today.
Will recheck BP and K at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-072169",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-072169",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
