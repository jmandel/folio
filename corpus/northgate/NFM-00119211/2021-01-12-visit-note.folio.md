---
folio: "0.1"
id: "01EVW75HE0NBGHKXF46KHQ2VTJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00119211"
effective: "2021-01-12T10:00:00-06:00"
recorded: "2021-01-12T15:14:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well, no new symptoms.
BP 132/84, pulse 72, wt 198 lb.
Today: eGFR 62, A1c 7.2%, LDL 96 mg/dL.
Results reviewed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-011273",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-011273",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
