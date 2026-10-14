---
folio: "0.1"
id: "01J2YGTFE0H5X9CKBEQBKXR91D"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00473834"
effective: "2024-07-16T08:40:00-05:00"
recorded: "2024-07-16T14:38:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. No new complaints.
BP 145/90, pulse 72, wt 234 lb.
eGFR 58, K 4.9, UACR 349 mg/g, A1c 8.1%, LDL 49 today.
Insulin glargine started today, 10 units at bedtime (A1c 8.1). Pt taught pen use and low sugar signs.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-071679",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-071679",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  }
}
```
