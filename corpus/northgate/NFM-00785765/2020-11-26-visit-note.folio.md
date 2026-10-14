---
folio: "0.1"
id: "01ER3FBJF0MCED81AXNXQP12E6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00785765"
effective: "2020-11-26T13:40:00-06:00"
recorded: "2020-11-26T17:49:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No problems since last visit.
BP 139/76, pulse 66, wt 218 lb.
Today: eGFR 65, K 4.2, UACR 7 mg/g, A1c 8%.
Went over results, A1c a little higher. Pt agrees to keep working on diet.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-112692",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-112692",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-112692",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
