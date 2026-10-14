---
folio: "0.1"
id: "01FMWXGPK05FA464X6TTZSS10S"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00071637"
effective: "2021-11-19T10:45:00-06:00"
recorded: "2021-11-19T14:17:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
New pt, establishing care. Hx reviewed with pt.

BP 139/81, pulse 63, wt 199 lb. Labs 11/17: eGFR 55, K 4.6, A1c 8.4%, LDL 71.

A1c above goal today. Metformin increased to 1000 mg BID.

RTC in a few months to recheck.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2021-111989",
    "visit_type": "office",
    "reason": "New patient, establish care"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2021-111989",
    "rank": 1,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2021-111989",
    "rank": 2,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
