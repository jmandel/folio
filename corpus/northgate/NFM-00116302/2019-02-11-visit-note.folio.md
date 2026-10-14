---
folio: "0.1"
id: "01D3FDMR20RYDFC9CEMZPTVPPC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00116302"
effective: "2019-02-11T13:15:00-06:00"
recorded: "2019-02-11T17:18:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.
BP 126/71, pulse 62, wt 241 lb.
Labs today: eGFR 63, K 4, UACR 9 mg/g, A1c 7.7%, LDL 99 mg/dL.
Reviewed results with pt. Questions answered.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-021145",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-021145",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
