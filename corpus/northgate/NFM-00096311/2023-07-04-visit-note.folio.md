---
folio: "0.1"
id: "01H4HABMM01P0CW6HZKPH1R6BQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00096311"
effective: "2023-07-04T11:45:00-05:00"
recorded: "2023-07-04T15:44:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 137/83, pulse 63, wt 173 lb.

Labs today: eGFR 59, K 4.4, UACR 116 mg/g, A1c 7.8%.

UACR higher than before, will follow. Pt feels well.

RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-070487",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-070487",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
