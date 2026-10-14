---
folio: "0.1"
id: "01FKEZF2J0RZZNPKE3TZFEDSDE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00351015"
effective: "2021-11-01T13:20:00-05:00"
recorded: "2021-11-01T19:06:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Tolerating bedtime insulin, no lows reported.
BP 135/82, pulse 87, wt 149 lb.
Labs 10/26: eGFR 88, K 4, UACR 80 mg/g, A1c 7.6%.
RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-110156",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-110156",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-110156",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
