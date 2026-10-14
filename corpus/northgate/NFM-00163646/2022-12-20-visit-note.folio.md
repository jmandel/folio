---
folio: "0.1"
id: "01GMS2PPF0MBJ2G3CPFC8WGQZR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00163646"
effective: "2022-12-20T13:45:00-06:00"
recorded: "2022-12-20T18:53:00-06:00"
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

BP 126/79, pulse 75, wt 163 lb.
Labs 12/15: eGFR 97, A1c 7.8%.

Records requested from prior office. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-122093",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-122093",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
