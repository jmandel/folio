---
folio: "0.1"
id: "01H91TGNB0ZQ7T550R9PDE45P9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00871242"
effective: "2023-08-29T13:40:00-05:00"
recorded: "2023-08-29T18:37:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Pt feeling well, no new symptoms.
BP 123/72, pulse 72, wt 141 lb.
Continue current plan. Foot check done.
Reminded pt on diet and exercise.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-082953",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-082953",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
