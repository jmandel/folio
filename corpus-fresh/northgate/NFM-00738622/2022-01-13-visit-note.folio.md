---
folio: "0.1"
id: "01FSAC5KJ05JGJ7RJQX9RS1204"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00738622"
effective: "2022-01-13T09:00:00-06:00"
recorded: "2022-01-13T12:46:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Doing OK.
BP 141/86, repeat 139/82, pulse 63, wt 214 lb.
Labs 1/10: A1c 7.3%, eGFR 68, K 4.5, UACR 703 mg/g.
BP still above goal on repeat. Will recheck at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-011348",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-011348",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-011348",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
