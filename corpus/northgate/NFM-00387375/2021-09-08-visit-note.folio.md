---
folio: "0.1"
id: "01FF3M3FV0NEXA1G40ZBVFRR6N"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00387375"
effective: "2021-09-08T13:15:00-05:00"
recorded: "2021-09-08T16:13:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well, no new concerns.
BP 122/72, pulse 72, wt 180 lb.
eGFR 85 today.
Reviewed diet and activity with pt.
RTC 6–8 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-090883",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-090883",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-090883",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
