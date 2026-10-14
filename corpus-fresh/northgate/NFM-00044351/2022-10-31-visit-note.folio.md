---
folio: "0.1"
id: "01GGQQNBJ0WZCBAAXS37A5EXR6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00044351"
effective: "2022-10-31T09:40:00-05:00"
recorded: "2022-10-31T14:18:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 122/69, pulse 66, wt 239 lb.

10/25 labs: eGFR 73, K 4.2, A1c 7.8%.

BP at goal. A1c creeping up, discussed diet and activity. RTC 4-5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-103183",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-103183",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
