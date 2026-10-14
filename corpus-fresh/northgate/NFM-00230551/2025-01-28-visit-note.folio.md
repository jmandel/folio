---
folio: "0.1"
id: "01JJQC74E0JJ0YMZN09Z6QEVX0"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00230551"
effective: "2025-01-28T12:30:00-06:00"
recorded: "2025-01-28T15:14:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u for acute kidney injury. Feels well, eating and drinking normally.
BP 136/78, pulse 87, wt 220 lb.
losartan: resumed today (creatinine back to baseline)
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-012881",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-012881",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  }
}
```
