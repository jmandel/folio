---
folio: "0.1"
id: "01DMGVWGK0B0MMJR7712QWQ3VS"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00883307"
effective: "2019-09-11T11:50:00-05:00"
recorded: "2019-09-11T14:13:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.
BP 130/81, pulse 71, wt 123 lb.
Labs today: eGFR 45, K 4.7, UACR 106 mg/g, A1c 6.8%, LDL 120 mg/dL.
Reviewed results with pt. Will recheck kidney labs at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-091115",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-091115",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
