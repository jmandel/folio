---
folio: "0.1"
id: "01EMF6BXG0QVXJV91NVK8JK2X8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00096311"
effective: "2020-10-12T12:20:00-05:00"
recorded: "2020-10-12T15:00:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. BP 132/77, pulse 66, wt 170 lb.

Labs 10/8: eGFR 67, K 4.3, UACR 94 mg/g, A1c 7.8%.

A1c up a little from spring. Pt feels well. Reviewed home glucose log.

RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-101232",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-101232",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-101232",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
