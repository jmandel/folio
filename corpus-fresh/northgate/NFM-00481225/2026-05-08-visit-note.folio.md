---
folio: "0.1"
id: "01KR4TMPV0CPYSZ4K97W1NMJWG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00481225"
effective: "2026-05-08T13:30:00-05:00"
recorded: "2026-05-08T17:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. A1c 8.2 and BP well above goal.

BP 161/99, pulse 63, wt 220 lb.

Semaglutide started 0.5 mg weekly today. Chlorthalidone started 12.5 mg daily today (BP above goal). Injection technique and side effects reviewed.

RTC 6 wk for BP check.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-050894",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-050894",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-050894",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
