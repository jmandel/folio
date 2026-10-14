---
folio: "0.1"
id: "01FTRS39Z0Z35F4F817DGZYSC2"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00650029"
effective: "2022-01-31T11:40:00-06:00"
recorded: "2022-01-31T13:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u.
BP 131/73, pulse 65, wt 189 lb.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-013162",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-013162",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
