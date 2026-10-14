---
folio: "0.1"
id: "01K2JEAZA0AXFGJYXVNW53X9TE"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00236387"
effective: "2025-08-13T11:15:00-05:00"
recorded: "2025-08-13T14:26:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:treyes"
  name: "Teresa Reyes, MD"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 132/79, pulse 67, wt 184 lb.
Labs today: eGFR 76, K 4.3, A1c 6.6%, LDL 101 mg/dL.
Doing well, no complaints. BP at goal.
RTC 6 mo.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-081398",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-081398",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-081398",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
