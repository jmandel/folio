---
folio: "0.1"
id: "01EAN50Y50YGQ35W8ZMSNNVCTA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00888547"
effective: "2020-06-12T11:00:00-05:00"
recorded: "2020-06-12T15:55:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit.

BP 149/85, repeat 147/84, pulse 74, wt 200 lb.
eGFR 68 and K 4.8 today.

BP above goal today. Pt to check BP at home. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-061251",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-061251",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
