---
folio: "0.1"
id: "01DYK6X2Q00V9CSV262PQ6EPYA"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00103205"
effective: "2020-01-14T13:50:00-06:00"
recorded: "2020-01-14T17:41:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Feels well, no new complaints.
BP 128/80, pulse 74, wt 205 lb.
Labs 1/12: eGFR 73, K 4.1, UACR 182 mg/g, A1c 7.5%.
Discussed diet and activity. Will recheck urine albumin at next visit.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-011411",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-011411",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-011411",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
