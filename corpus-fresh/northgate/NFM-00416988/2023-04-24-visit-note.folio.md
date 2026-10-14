---
folio: "0.1"
id: "01GYT93CK04C5ZWC3VAZ4D7VTY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00416988"
effective: "2023-04-24T12:10:00-05:00"
recorded: "2023-04-24T13:41:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new complaints.
BP 140/85, repeat 135/82, pulse 88, wt 203 lb.
Today: eGFR 94, K 4.1, A1c 6.3%, LDL 131 mg/dL.
Continue current plan. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-042433",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-042433",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
