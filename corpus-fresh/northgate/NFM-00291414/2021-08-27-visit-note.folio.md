---
folio: "0.1"
id: "01FE52S2K01RBGDEP5YYB96ZDF"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00291414"
effective: "2021-08-27T13:20:00-05:00"
recorded: "2021-08-27T19:33:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No new symptoms.
BP 135/82, pulse 76, wt 163 lb.
eGFR 67, K 4.6, A1c 7.6% today. A1c up from last time.
Diet and exercise reviewed.
RTC 4-5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-082719",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-082719",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-082719",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
