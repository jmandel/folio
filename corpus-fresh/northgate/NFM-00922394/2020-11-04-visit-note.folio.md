---
folio: "0.1"
id: "01EPAS9MT03AA6465B35MB32XC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00922394"
effective: "2020-11-04T13:40:00-06:00"
recorded: "2020-11-04T17:26:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM2 f/u. No complaints.

BP 145/85, repeat 139/83, pulse 76, wt 155 lb.
11/2: eGFR 70, K 4.3, A1c 7.2%, LDL 72 mg/dL.

Discussed diet and activity. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-110485",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-110485",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
