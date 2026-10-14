---
folio: "0.1"
id: "01HXCJMQK00WM21BBRMSPRDNBM"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00474892"
effective: "2024-05-08T09:45:00-05:00"
recorded: "2024-05-08T12:05:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing well, no concerns.
BP 123/72, pulse 86, wt 136 lb.
Labs 5/3: eGFR 52, K 4.5, A1c 7.5%.
Continue current plan.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-050825",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-050825",
    "rank": 1,
    "icd10cm": "N18.31",
    "display": "Chronic kidney disease, stage 3a"
  }
}
```
