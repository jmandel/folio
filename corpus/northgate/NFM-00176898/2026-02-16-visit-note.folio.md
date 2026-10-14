---
folio: "0.1"
id: "01KHMAVCS0RB92YTGTAEN4SQ7Z"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00176898"
effective: "2026-02-16T13:45:00-06:00"
recorded: "2026-02-16T16:59:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 133/77, pulse 87, wt 186 lb.
Labs today: eGFR 40, K 4.6, UACR 271 mg/g, A1c 7.8%.
A1c a little better than before. Kidney numbers stable. Pt feels well.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-021681",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-021681",
    "rank": 1,
    "icd10cm": "N18.32",
    "display": "Chronic kidney disease, stage 3b"
  }
}
```
