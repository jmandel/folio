---
folio: "0.1"
id: "01EM2M1RV0SYTH5G64WZEE6MCD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00996346"
effective: "2020-10-07T12:50:00-05:00"
recorded: "2020-10-07T17:49:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 124/80, pulse 75, wt 192 lb.

Labs 10/1: A1c 7.2%, eGFR 67, K 4.7, UACR 255 mg/g.

Discussed diet and activity. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-100733",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-100733",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-100733",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
