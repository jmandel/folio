---
folio: "0.1"
id: "01F5E68Z60HKGBYV98TWCMAQ20"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00103205"
effective: "2021-05-11T09:00:00-05:00"
recorded: "2021-05-11T12:06:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Annual exam. Doing well, no complaints.
BP 125/74, pulse 83, wt 205 lb.
Labs today: eGFR 71, K 4.3, A1c 7.3%.
A1c improved. Continue current plan, encouraged exercise.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-051161",
    "visit_type": "office",
    "reason": "Annual exam"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-051161",
    "rank": 1,
    "icd10cm": "Z00.00",
    "display": "Encounter for general adult medical examination without abnormal findings"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-051161",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
