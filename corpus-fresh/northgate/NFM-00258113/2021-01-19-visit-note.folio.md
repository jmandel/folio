---
folio: "0.1"
id: "01EWEM6DG05QGT7SHFBCZEFS6C"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00258113"
effective: "2021-01-19T15:45:00-06:00"
recorded: "2021-01-19T18:48:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit.
BP 129/84, pulse 76, wt 169 lb.
Labs 1/15: eGFR 64, K 3.8, A1c 8.5%.
Started insulin glargine 10 units at bedtime today (A1c 8.5). Reviewed injection technique and low sugar symptoms with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-011984",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-011984",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-011984",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
