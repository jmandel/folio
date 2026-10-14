---
folio: "0.1"
id: "01E0ENRSW0YTXK0BJS4H5JQQWR"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00413130"
effective: "2020-02-06T15:45:00-06:00"
recorded: "2020-02-06T19:56:00-06:00"
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
BP 130/78, pulse 74, wt 184 lb.
Labs 2/2: eGFR 88, K 4.4, A1c 8.2%, LDL 72.
A1c 8.2, started dapagliflozin 10 mg daily today.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-020615",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-020615",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
