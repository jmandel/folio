---
folio: "0.1"
id: "01G3BW5XE0BCH4WF6VGPF7DSXR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00004878"
effective: "2022-05-18T08:50:00-05:00"
recorded: "2022-05-18T10:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Records and labs from 5/13 reviewed.
BP 157/96, repeat 151/95, pulse 81, wt 183 lb.
eGFR 76, K 4.4, UACR 62 mg/g, A1c 6.4%, LDL 154 mg/dL.
BP above goal, UACR elevated. Will recheck and follow closely.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-051834",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-051834",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
