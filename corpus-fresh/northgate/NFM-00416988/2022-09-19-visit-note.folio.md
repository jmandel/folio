---
folio: "0.1"
id: "01GDC3NTY0PF5ZC93T5G9NTYPJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00416988"
effective: "2022-09-19T15:50:00-05:00"
recorded: "2022-09-19T19:10:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Feels well, no new issues.
BP 137/80, pulse 69, wt 202 lb.
Today: eGFR 94, K 4.9, A1c 6.1%.
Continue current plan. RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-091972",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-091972",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
