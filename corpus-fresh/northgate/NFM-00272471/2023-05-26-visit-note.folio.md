---
folio: "0.1"
id: "01H1D80ND0H6HQT8CAJHRWQJN8"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00272471"
effective: "2023-05-26T12:45:00-05:00"
recorded: "2023-05-26T18:59:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well.
BP 111/68, pulse 66, wt 150 lb.
Labs today: eGFR 61, K 4.7, A1c 7.8%.
RTC 4-5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-052661",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-052661",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-052661",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2023-052661",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
