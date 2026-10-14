---
folio: "0.1"
id: "01GSR317P004CKVANKCTGTYRFB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00119211"
effective: "2023-02-20T08:30:00-06:00"
recorded: "2023-02-20T12:58:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing well, no concerns.
BP 127/74, pulse 70, wt 201 lb.
Today: eGFR 62, A1c 7.1%.
Results reviewed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-022057",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-022057",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
