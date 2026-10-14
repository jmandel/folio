---
folio: "0.1"
id: "01DHVP4CQ0JY27DBT5TX4KGENG"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00924817"
effective: "2019-08-09T09:40:00-05:00"
recorded: "2019-08-09T12:17:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.
BP 138/79, pulse 69, wt 245 lb.
Labs today: eGFR 99, K 4.3, LDL 96 mg/dL.
Records to be requested from prior office.
RTC to review results and plan.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-080922",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-080922",
    "rank": 1,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
