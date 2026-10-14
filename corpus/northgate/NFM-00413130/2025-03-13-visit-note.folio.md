---
folio: "0.1"
id: "01JP8PEJ50BZ3KWNP7FXZGEFP1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00413130"
effective: "2025-03-13T12:20:00-05:00"
recorded: "2025-03-13T16:27:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well.
BP 121/74, pulse 63, wt 187 lb.
Today: eGFR 83, K 4.5, A1c 7.8%.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-031352",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-031352",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
