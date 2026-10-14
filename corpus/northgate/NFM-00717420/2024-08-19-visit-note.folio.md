---
folio: "0.1"
id: "01J5P0KZM090QMGSD2YS2TYXDG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00717420"
effective: "2024-08-19T09:50:00-05:00"
recorded: "2024-08-19T14:08:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new complaints.
BP 121/71, pulse 82, wt 146 lb.
Labs 8/17: eGFR 75, K 4.2, UACR 130 mg/g, A1c 7.9%, LDL 91 mg/dL.
Continue current plan. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-081993",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-081993",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
