---
folio: "0.1"
id: "01GK3700B026GAX80GWVT3ZWWA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00437548"
effective: "2022-11-29T15:45:00-06:00"
recorded: "2022-11-29T20:49:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Doing well, no new concerns.

BP 127/76, pulse 88, wt 255 lb.
Labs 11/23: eGFR 84, A1c 7.2%.

Continue current plan. Encouraged diet and exercise.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-112978",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-112978",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
