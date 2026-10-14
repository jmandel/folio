---
folio: "0.1"
id: "01FV12Q250YNC266B2HSGWC3C6"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00482130"
effective: "2022-02-03T13:20:00-06:00"
recorded: "2022-02-03T18:39:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Feels well.
BP 134/81, pulse 64, wt 163 lb.
Labs today: eGFR 63, K 4.6, A1c 7.5%, LDL 172 mg/dL.
A1c up from last check. Diet reviewed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-020319",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-020319",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
