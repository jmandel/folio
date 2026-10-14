---
folio: "0.1"
id: "01DS0Y2RE0MSRCWTY8GQ2W34YW"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00116302"
effective: "2019-11-06T09:30:00-06:00"
recorded: "2019-11-06T12:02:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No complaints, doing ok.
BP 120/71, pulse 62, wt 242 lb.
Labs today: eGFR 64, K 4.3, UACR 12 mg/g, A1c 7.6%.
Results reviewed with pt.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-110632",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-110632",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
