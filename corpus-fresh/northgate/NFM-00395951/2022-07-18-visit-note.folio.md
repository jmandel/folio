---
folio: "0.1"
id: "01G8A5NVR0ES72KKHVWFNA1HSN"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00395951"
effective: "2022-07-18T15:45:00-05:00"
recorded: "2022-07-18T21:48:00-05:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx HTN, DM2 and hyperlipidemia, all per pt.

BP 150/96, repeat 143/96. Pulse 71, wt 126 lb.

Labs today: eGFR 93, K 4.4, A1c 7.9%, LDL 83 mg/dL.

Records requested from prior office. Will review results and plan at next visit.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2022-071816",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2022-071816",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2022-071816",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
