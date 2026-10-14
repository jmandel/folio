---
folio: "0.1"
id: "01GZD1JFD0BGB89B9X1QB4RKJB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00759365"
effective: "2023-05-01T15:30:00-05:00"
recorded: "2023-05-01T20:35:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing well, no complaints.
BP 136/81, pulse 85, wt 193 lb.
4/28 labs: eGFR 65, K 4.3, A1c 7.1%, LDL 104.
LDL a bit higher than last check, reviewed diet.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-050184",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-050184",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-050184",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
