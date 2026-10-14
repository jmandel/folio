---
folio: "0.1"
id: "01J3KQVKF0VK1HQP7DKE8XJ1B3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00927255"
effective: "2024-07-24T15:45:00-05:00"
recorded: "2024-07-24T20:25:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Hosp f/u for acute kidney injury. Feels back to baseline, eating and drinking normally.

BP 135/78, pulse 70, wt 179 lb.

Lisinopril: resumed today (creatinine back to baseline).

Pt to call if lightheaded or urinating less. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-072435",
    "visit_type": "office",
    "reason": "Hosp f/u"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-072435",
    "rank": 1,
    "icd10cm": "Z09",
    "display": "Follow-up exam after completed treatment"
  }
}
```
