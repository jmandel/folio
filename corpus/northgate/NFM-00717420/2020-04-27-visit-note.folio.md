---
folio: "0.1"
id: "01E6YJSH604FP2N2A08P9VDYG9"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00717420"
effective: "2020-04-27T12:15:00-05:00"
recorded: "2020-04-27T14:46:00-05:00"
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
BP 117/66, pulse 87, wt 146 lb.
Labs today: eGFR 82, K 3.8, UACR 115 mg/g, A1c 8%, LDL 93 mg/dL.
Will review results together and plan follow-up.
RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2020-042724",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2020-042724",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
