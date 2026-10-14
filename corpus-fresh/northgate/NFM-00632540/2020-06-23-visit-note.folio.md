---
folio: "0.1"
id: "01EBHMC4T0V1964GQ7V0KXDZPB"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00632540"
effective: "2020-06-23T11:00:00-05:00"
recorded: "2020-06-23T17:22:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.

BP 132/77, pulse 69, wt 237 lb.

Labs today: eGFR 49, K 4.2, A1c 6.9%, LDL 70.

Problem list entered from pt history. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-062329",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-062329",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
