---
folio: "0.1"
id: "01GVE8H1B04X4SGEN9K9M4DFVQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00257732"
effective: "2023-03-13T11:50:00-05:00"
recorded: "2023-03-13T14:53:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new symptoms.
BP 135/85, pulse 80, wt 170 lb.
Home readings reviewed. Continue current plan.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-031324",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-031324",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
