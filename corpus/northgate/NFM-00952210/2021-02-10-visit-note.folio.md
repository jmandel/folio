---
folio: "0.1"
id: "01EY75EH902V2Z0YCT3Y0VDBPQ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00952210"
effective: "2021-02-10T11:45:00-06:00"
recorded: "2021-02-10T17:47:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well, no new complaints.

BP 120/73, pulse 71, wt 148 lb.
Labs 2/6: eGFR 77, K 3.8. Reviewed with pt.
RTC 1 yr.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-021049",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-021049",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-021049",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
