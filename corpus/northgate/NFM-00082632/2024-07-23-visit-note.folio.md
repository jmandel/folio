---
folio: "0.1"
id: "01J3GZ5F50QGMPJ9381N5H9P4P"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00082632"
effective: "2024-07-23T15:20:00-05:00"
recorded: "2024-07-23T18:35:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 137/83, pulse 64, wt 195 lb.
Labs today: eGFR 89, K 4, A1c 8.3%.
A1c up. Semaglutide started 0.5 mg weekly today (A1c 8.3). Reviewed injection technique with pt.
RTC 3-4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-072331",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-072331",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-072331",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
