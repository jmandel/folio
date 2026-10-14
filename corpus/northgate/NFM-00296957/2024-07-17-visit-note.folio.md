---
folio: "0.1"
id: "01J31DGSA0RNEV34YZ30VJX8PX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00296957"
effective: "2024-07-17T13:15:00-05:00"
recorded: "2024-07-17T17:38:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 134/80, pulse 65, wt 177 lb.
Labs today: A1c 7.7%, eGFR 59, K 3.8, UACR 973 mg/g.
Reviewed results with pt, who has no new complaints.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-071785",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-071785",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
