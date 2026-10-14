---
folio: "0.1"
id: "01FN7GWP40THGC4F5QX4WZ38K4"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00119211"
effective: "2021-11-23T11:00:00-06:00"
recorded: "2021-11-23T17:08:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No complaints today.
BP 125/77, pulse 81, wt 199 lb.
Today: eGFR 61, UACR 189 mg/g, A1c 7.8%.
Discussed results with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-112352",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-112352",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
