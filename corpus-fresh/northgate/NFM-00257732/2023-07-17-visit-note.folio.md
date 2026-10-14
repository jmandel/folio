---
folio: "0.1"
id: "01H5JTYRF0Q1JKFPSPNEETAAWV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00257732"
effective: "2023-07-17T11:30:00-05:00"
recorded: "2023-07-17T16:09:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. Pt doing OK, no complaints.
BP 136/84, pulse 84, wt 167 lb.
Meds reviewed with pt, no changes.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-071779",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-071779",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
