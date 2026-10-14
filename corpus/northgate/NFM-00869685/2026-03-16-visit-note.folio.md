---
folio: "0.1"
id: "01KKW5SNW00VPZT65WX0N1AYWD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00869685"
effective: "2026-03-16T13:40:00-05:00"
recorded: "2026-03-16T15:36:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. BP 133/84, pulse 77, wt 203 lb.
Labs 3/14: eGFR 96, K 3.8.
Labs reviewed with pt, no concerns. No changes today.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-031617",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-031617",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
