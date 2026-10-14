---
folio: "0.1"
id: "01KE8DRQR0QF0W49ZP942K57SK"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00568295"
effective: "2026-01-05T13:10:00-06:00"
recorded: "2026-01-05T19:12:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No new complaints.
BP 137/86, pulse 87, wt 212 lb.
Labs 1/3: eGFR 46, K 4.9, A1c 6.7%.
Continue current plan.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-010514",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-010514",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
