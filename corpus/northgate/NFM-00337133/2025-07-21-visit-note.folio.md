---
folio: "0.1"
id: "01K0QHNGZ0XK8AEQ55XT9BD7QP"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00337133"
effective: "2025-07-21T12:20:00-05:00"
recorded: "2025-07-21T17:29:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:jpatel"
  name: "Jaya Patel, NP"
  role: "Nurse practitioner"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. Doing well, no new symptoms.
BP 132/76, pulse 69, wt 168 lb.
Labs today: eGFR 86, K 4.3, A1c 6.8%, LDL 119 mg/dL.
Results reviewed with pt. RTC 3 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-072154",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-072154",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  }
}
```
