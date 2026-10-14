---
folio: "0.1"
id: "01KN38GW20189WPE3YZDJK1FMD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00303697"
effective: "2026-03-31T13:30:00-05:00"
recorded: "2026-03-31T19:54:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
BP f/u. BP 136/80, pulse 67, wt 204 lb.
Labs 3/25: eGFR 99, K 4.7.
No new complaints today.
Pt to keep taking meds as listed.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-033194",
    "visit_type": "office",
    "reason": "BP follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-033194",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
