---
folio: "0.1"
id: "01F0YEQ9S0GBGAKTTX6WJGHJ2Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00996346"
effective: "2021-03-16T13:15:00-05:00"
recorded: "2021-03-16T16:23:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 122/68, pulse 67, wt 194 lb.

Labs 3/13: A1c 7.7%, eGFR 67, K 4.2.

A1c up a bit from last time, reviewed with pt. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-031692",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-031692",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-031692",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
