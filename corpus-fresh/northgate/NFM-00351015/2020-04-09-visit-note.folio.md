---
folio: "0.1"
id: "01E5GBH3J0Y30J5T2D42PG9WGJ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00351015"
effective: "2020-04-09T12:20:00-05:00"
recorded: "2020-04-09T15:54:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u.
BP 140/85, repeat 138/82, pulse 87, wt 151 lb.
Labs today: eGFR 90, K 4.3, UACR 57 mg/g, A1c 7.6%, LDL 104.
Reviewed with pt. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-040968",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-040968",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2020-040968",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
