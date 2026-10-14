---
folio: "0.1"
id: "01DHHA88Z0VH85Z5W37WH9TR25"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00996346"
effective: "2019-08-05T08:40:00-05:00"
recorded: "2019-08-05T11:37:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 130/76, pulse 79, wt 193 lb.

A1c 7.2% today. eGFR 72. UACR 165 mg/g.

First K 6.3 was hemolyzed, repeat K 4.1.

RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-080586",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-080586",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-080586",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
