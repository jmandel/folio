---
folio: "0.1"
id: "01GA4JAKV0VVDAGBV9CA811EHG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00140901"
effective: "2022-08-10T11:45:00-05:00"
recorded: "2022-08-10T14:05:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 114/68, pulse 81, wt 241 lb.

Labs today: A1c 8.5%, eGFR 67, K 4.3.

Metformin increased to 1000 mg BID today for A1c 8.5.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-081058",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-081058",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
