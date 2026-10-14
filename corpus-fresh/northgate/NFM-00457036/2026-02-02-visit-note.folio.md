---
folio: "0.1"
id: "01KGG2ZXF09GCFXGH3XSBMCG36"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00457036"
effective: "2026-02-02T09:15:00-06:00"
recorded: "2026-02-02T15:09:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.

BP 132/74, pulse 66, wt 257 lb.
1/27 labs: eGFR 61, K 4.3, UACR 14 mg/g, A1c 7.8%.

A1c a bit higher than last time, discussed with pt. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-020299",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-020299",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
