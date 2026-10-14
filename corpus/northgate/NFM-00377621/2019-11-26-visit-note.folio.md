---
folio: "0.1"
id: "01DTMJYKG0VVXSHWFB1E46WJQC"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00377621"
effective: "2019-11-26T10:30:00-06:00"
recorded: "2019-11-26T13:28:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establish care. Hx reviewed with pt.
BP 126/76, pulse 65, wt 129 lb.
Labs today: A1c 6.3%, eGFR 64, K 4, LDL 72 mg/dL, UACR 397 mg/g.
Discussed DM2 and lipid hx, records to be requested.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2019-112613",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2019-112613",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2019-112613",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
