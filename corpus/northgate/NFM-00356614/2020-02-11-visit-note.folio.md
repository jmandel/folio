---
folio: "0.1"
id: "01E0TP25G0F9HNBTFAHSE0QMJ1"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00356614"
effective: "2020-02-11T08:10:00-06:00"
recorded: "2020-02-11T11:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.
BP 136/77, pulse 76, wt 233 lb.
eGFR 67, K 4.8, UACR 184 mg/g, A1c 7.7% today.
A1c better than last visit. Continue current plan.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-021111",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-021111",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-021111",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
