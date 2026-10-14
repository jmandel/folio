---
folio: "0.1"
id: "01JRBHF1Q0H0D42859QY2AMMRE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00103205"
effective: "2025-04-08T12:20:00-05:00"
recorded: "2025-04-08T15:29:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well overall.
BP 128/81, pulse 77, wt 204 lb.
Labs today: eGFR 55, K 4.2, A1c 6.8%.
eGFR lower than last year, will keep following closely.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-040856",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-040856",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-040856",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2025-040856",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
