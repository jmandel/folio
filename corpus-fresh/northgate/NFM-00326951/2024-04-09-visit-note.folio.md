---
folio: "0.1"
id: "01HV1YRZT0TWRTYBR5GKF34SNZ"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00326951"
effective: "2024-04-09T08:00:00-05:00"
recorded: "2024-04-09T12:34:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing well, no new complaints. BP 122/75, pulse 65, wt 189 lb.

Reviewed home glucose readings with pt. Sick-day rules reminder given.

RTC 3-6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2024-040922",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2024-040922",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
