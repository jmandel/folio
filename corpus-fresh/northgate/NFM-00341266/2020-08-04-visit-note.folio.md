---
folio: "0.1"
id: "01EEXG4P60E1J8HEAWH23AHAQD"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00341266"
effective: "2020-08-04T12:00:00-05:00"
recorded: "2020-08-04T14:46:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.
BP 127/82, pulse 75, wt 186 lb.
7/31 labs: A1c 7.2%, eGFR 58, K 4.2, LDL 135.
Records requested from prior office.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-080476",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-080476",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
