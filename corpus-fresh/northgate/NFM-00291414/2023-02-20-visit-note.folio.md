---
folio: "0.1"
id: "01GSRBJ250V4VB69A9X6PVJ3SM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00291414"
effective: "2023-02-20T12:15:00-06:00"
recorded: "2023-02-20T15:27:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new symptoms.
BP 143/87, repeat 139/85, pulse 77, wt 159 lb.
eGFR 64, K 4.5, A1c 7.4% today.
BP borderline on repeat. Continue home BP checks.
RTC 5-6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-022028",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-022028",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
