---
folio: "0.1"
id: "01KQFMT19039KGHSWTJ86T5GN5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00326951"
effective: "2026-04-30T09:30:00-05:00"
recorded: "2026-04-30T11:51:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well. BP 128/76, pulse 63, wt 193 lb.

Reviewed home readings, no problems reported. Continue current plan.

RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-043067",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-043067",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
