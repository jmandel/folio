---
folio: "0.1"
id: "01E35PP7P0FZGP2TJ02E7B4HSA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00257732"
effective: "2020-03-11T09:45:00-05:00"
recorded: "2020-03-11T16:06:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Records and history reviewed with pt.
BP 118/67, pulse 73, wt 169 lb.
A1c 8.7. Metformin changed to 1000 mg twice daily today.
Diet and activity discussed.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-031193",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-031193",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
