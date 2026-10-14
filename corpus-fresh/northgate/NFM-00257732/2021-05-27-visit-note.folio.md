---
folio: "0.1"
id: "01F6R61ET0R32039Q8MF4YF1Q3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00257732"
effective: "2021-05-27T14:30:00-05:00"
recorded: "2021-05-27T19:30:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. A1c 8.7, with CKD.
BP 124/73, pulse 86, wt 170 lb.
Dapagliflozin 10 mg daily started today. Reviewed genital hygiene and hydration with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-052726",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-052726",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
