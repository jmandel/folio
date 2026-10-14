---
folio: "0.1"
id: "01KDBRT2X0B0SP1Z3FTS8G7882"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00016041"
effective: "2025-12-25T11:10:00-06:00"
recorded: "2025-12-25T16:07:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints today.
BP 135/81, pulse 81, wt 186 lb.
Labs today: eGFR 78, K 4.4, A1c 7.4%.
A1c up from last check, discussed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-122556",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-122556",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
