---
folio: "0.1"
id: "01J2J1FHN0XGT1EGRWYHQ89MGA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00732614"
effective: "2024-07-11T15:45:00-05:00"
recorded: "2024-07-11T18:19:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u for acute kidney injury. Feels better, eating and drinking normally.

BP 158/78, repeat 150/74, pulse 88, wt 200 lb.

Losartan resumed today (creatinine back to baseline). Pt to recheck BP at home.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-071199",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-071199",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  }
}
```
