---
folio: "0.1"
id: "01H9KJFPX0HBA9NVGS0Z7414D3"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00213380"
effective: "2023-09-05T14:15:00-05:00"
recorded: "2023-09-05T16:03:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new complaints, eating normally.
BP 127/75, pulse 87, wt 155 lb.
Meds reviewed, no side effects reported.
Continue current plan.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-090576",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-090576",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
