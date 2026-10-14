---
folio: "0.1"
id: "01EQ9VV6S0FRWB5CD5X1G78RZ3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00155300"
effective: "2020-11-16T13:30:00-06:00"
recorded: "2020-11-16T19:07:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. Hx reviewed with pt.
BP 130/76, pulse 66, wt 198 lb.
Labs today: eGFR 74, A1c 7%, LDL 142 mg/dL.
Reviewed results with pt. Problem list updated.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-111675",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-111675",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
