---
folio: "0.1"
id: "01KJZXTNT0C9JHQKVEBMNHH0XC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00677364"
effective: "2026-03-05T11:10:00-06:00"
recorded: "2026-03-05T15:18:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Feels well.
BP 118/73, pulse 70, wt 231 lb.
Labs today: eGFR 91, K 4.5, UACR 88 mg/g, A1c 7%, LDL 89 mg/dL.
Continue current plan. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-030514",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-030514",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
