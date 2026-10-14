---
folio: "0.1"
id: "01DFGXP5E09ZJ8WMKSZSD6KA0V"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00083633"
effective: "2019-07-11T08:10:00-05:00"
recorded: "2019-07-11T11:26:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care f/u. Doing well, no new complaints.
BP 137/80, pulse 85, wt 143 lb.
eGFR 61, K 4.4, A1c 6.8% today.
Labs reviewed with pt, reassured.
RTC 5 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-071192",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-071192",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
