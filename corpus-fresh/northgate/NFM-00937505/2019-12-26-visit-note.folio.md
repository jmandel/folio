---
folio: "0.1"
id: "01DX1YBVQ0YF0MWSH30QEJTMFV"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00937505"
effective: "2019-12-26T11:30:00-06:00"
recorded: "2019-12-26T14:29:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:dkhan"
  name: "Daniel Khan, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. History reviewed with pt.
BP 115/69, pulse 85, wt 190 lb.
Labs 12/23: eGFR 68, K 4.5, UACR 10 mg/g, A1c 6.8%, LDL 82 mg/dL.
Problem list built from pt's history.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-122672",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-122672",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-122672",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
