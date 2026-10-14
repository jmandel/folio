---
folio: "0.1"
id: "01KS1J5RD0HM632KJVXZ59YRQS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00580006"
effective: "2026-05-19T15:45:00-05:00"
recorded: "2026-05-19T21:07:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. Feels well overall.
BP 146/87, pulse 64, wt 175 lb.
Labs today: eGFR 80, K 4.4, UACR 364 mg/g, A1c 7.4%.
Results reviewed with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2026-051928",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2026-051928",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2026-051928",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
