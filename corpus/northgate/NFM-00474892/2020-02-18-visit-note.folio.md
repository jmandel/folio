---
folio: "0.1"
id: "01E1CXPXR0H2NBTZ9AQVF0F5YV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00474892"
effective: "2020-02-18T11:45:00-06:00"
recorded: "2020-02-18T13:52:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History per pt.
BP 128/76, pulse 62, wt 139 lb.
Labs today: eGFR 56, K 4.3, A1c 7.7%, LDL 101 mg/dL.
Reviewed HTN and DM2 history with pt.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-021851",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-021851",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
