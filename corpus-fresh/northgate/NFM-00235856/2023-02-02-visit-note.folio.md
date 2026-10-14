---
folio: "0.1"
id: "01GRA7J0C06R0WP4ZEQXA3NEWN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00235856"
effective: "2023-02-02T13:20:00-06:00"
recorded: "2023-02-02T17:32:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. History reviewed with pt.
BP 133/78, pulse 83, wt 206 lb.
Labs today: eGFR 78, K 4.5, UACR 58 mg/g, A1c 7.7%, LDL 53 mg/dL.
Problem list built from pt history.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2023-020292",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2023-020292",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2023-020292",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
