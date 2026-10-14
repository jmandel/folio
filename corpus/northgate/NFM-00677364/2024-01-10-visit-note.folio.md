---
folio: "0.1"
id: "01HKTK6A906Q9V2P9P61PH2431"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00677364"
effective: "2024-01-10T11:50:00-06:00"
recorded: "2024-01-10T15:07:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well.
BP 137/80, pulse 88, wt 232 lb.
Labs today: eGFR 96, K 4.2, UACR 84 mg/g, A1c 6.9%, LDL 94 mg/dL.
A1c at goal. Continue current plan, RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-011064",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-011064",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2024-011064",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
