---
folio: "0.1"
id: "01KGR1SKE0JMK5Y9RVWQ1QY4TX"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00271285"
effective: "2026-02-05T13:15:00-06:00"
recorded: "2026-02-05T17:22:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u.
BP 140/83, repeat 133/81, pulse 81, wt 182 lb.
Labs today: eGFR 68, K 4, UACR 59 mg/g, A1c 8.3%.
A1c 8.3, insulin glargine started 10 units at bedtime today.
BP above goal, amlodipine started 5 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-020517",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-020517",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
