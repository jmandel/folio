---
folio: "0.1"
id: "01KCWRSBY0MGMT21FZE7SM75GC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00937270"
effective: "2025-12-19T15:45:00-06:00"
recorded: "2025-12-19T20:18:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing well, no concerns.
BP 131/76, pulse 63, wt 194 lb.
Labs today: eGFR 86, K 4.2, A1c 7.7%.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-121997",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-121997",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
