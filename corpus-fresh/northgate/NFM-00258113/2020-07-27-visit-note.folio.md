---
folio: "0.1"
id: "01EE8PAHA0J7RK7PYJE20RP96T"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00258113"
effective: "2020-07-27T08:00:00-05:00"
recorded: "2020-07-27T12:50:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
Chronic care visit. No complaints.
BP 130/76, pulse 64, wt 170 lb.
Today: eGFR 63, K 4.2, A1c 8%, LDL 66.
A1c up from last check, discussed with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-072752",
    "visit_type": "office",
    "reason": "Chronic care visit"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-072752",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
