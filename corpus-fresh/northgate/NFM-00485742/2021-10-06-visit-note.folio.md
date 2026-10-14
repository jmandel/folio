---
folio: "0.1"
id: "01FHBKJDV0C5PAQKR28EA0XX63"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00485742"
effective: "2021-10-06T13:10:00-05:00"
recorded: "2021-10-06T15:09:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt, problem list entered from what pt reports.
BP 135/81, pulse 78, wt 233 lb.
Labs from 10/1: eGFR 52, K 4.4, UACR 147 mg/g, A1c 7.4%, LDL 71 mg/dL.
Will recheck labs at next visit.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-100637",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-100637",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-100637",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
