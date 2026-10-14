---
folio: "0.1"
id: "01FGSF46V0RDY60CM5T7P4QX2N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00341266"
effective: "2021-09-29T09:20:00-05:00"
recorded: "2021-09-29T14:05:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Feels well.
BP 125/70, pulse 73, wt 185 lb.
Labs today: A1c 7.3%, eGFR 59, K 4.1.
Continue current plan. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-092981",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-092981",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
