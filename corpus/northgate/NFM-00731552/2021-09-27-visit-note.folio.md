---
folio: "0.1"
id: "01FGM3R6J0BDBFFN7DFXZHGA32"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00731552"
effective: "2021-09-27T08:45:00-05:00"
recorded: "2021-09-27T12:10:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Lab f/u. Cr 1.12, eGFR 58 (9/20).
BP 138/86, pulse 76, wt 189 lb.
Kidney function slightly lower since the BP med change, will keep watching.
Pt has no new complaints. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-092771",
    "visit_type": "office",
    "reason": "Lab follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-092771",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-092771",
    "rank": 2,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
