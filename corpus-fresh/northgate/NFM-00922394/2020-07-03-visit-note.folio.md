---
folio: "0.1"
id: "01ECBJT7X06645X7K3DBJTG9Z5"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00922394"
effective: "2020-07-03T14:40:00-05:00"
recorded: "2020-07-03T19:15:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. Feeling well.

BP 139/80, pulse 79, wt 155 lb.
6/28: eGFR 71, K 4.6, A1c 6.6%.

Labs stable. RTC 4 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-070357",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-070357",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
