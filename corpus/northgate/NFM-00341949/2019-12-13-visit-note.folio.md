---
folio: "0.1"
id: "01DW0YZWK0BAFX22AMK95G33XY"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00341949"
effective: "2019-12-13T14:10:00-06:00"
recorded: "2019-12-13T19:05:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. BP 140/84, pulse 82, wt 226 lb.
Labs today: eGFR 73, K 4, A1c 7.2%.
A1c improved. BP a bit high today, will recheck next visit.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-121373",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-121373",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-121373",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
