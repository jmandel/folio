---
folio: "0.1"
id: "01DQQMSW50PJY6XBBZXEPJK3WP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00062738"
effective: "2019-10-21T09:45:00-05:00"
recorded: "2019-10-21T12:11:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx per pt.
BP 134/83, pulse 63, wt 140 lb.
Labs today: eGFR 67, K 4, UACR 69 mg/g, A1c 6.1%, LDL 119.
Problem list built from pt history.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-102173",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-102173",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-102173",
    "rank": 2,
    "icd10cm": "F33.0",
    "display": "Major depressive disorder, recurrent, mild",
    "restricted": "BH"
  }
}
```
