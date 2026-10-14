---
folio: "0.1"
id: "01DM1SVPV0Y1ZM2CXZS0KAFNAZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00335470"
effective: "2019-09-05T14:15:00-05:00"
recorded: "2019-09-05T17:49:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.
BP 134/79, pulse 63, wt 215 lb.
Labs today: eGFR 64, K 4.2, UACR 240 mg/g, A1c 6.9%.
Problem list built from pt's history.
RTC to review labs and plan.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-090558",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-090558",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-090558",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
