---
folio: "0.1"
id: "01JV58V6P0WSTW20FJ8JMARV6R"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00714159"
effective: "2025-05-13T09:00:00-05:00"
recorded: "2025-05-13T11:50:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feeling well, no new complaints.

BP 142/88, repeat 138/88, pulse 64, wt 214 lb.

Labs today: eGFR 98, K 4, A1c 6.9%.

Reviewed results with pt. Will recheck BP at next visit.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-051353",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-051353",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
