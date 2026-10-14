---
folio: "0.1"
id: "01KC2SAA50HMS050SF4BPBBV1Q"
issuer: "did:web:northgate-fm.example"
patient: "NFM-00045723"
effective: "2025-12-09T13:20:00-06:00"
recorded: "2025-12-09T18:07:00-06:00"
author:
  id: "urn:northgate-fm.example:staff:mbrennan"
  name: "Moira Brennan, DO"
  role: "Primary care physician"
schema:
  url: "https://northgate-fm.example/folio/schemas/northgate-chart-v1.d.ts"
  type: "ChartEvent"
  sha256: "6acf8173f46feaa52ea3fe53c95021debee891743166026f1f29596c2ce1b58b"
---
DM f/u. BP 129/73, pulse 67, wt 171 lb.

Labs 12/5: eGFR 69, K 4.8, A1c 7.3%, LDL 47 mg/dL. Reviewed with pt.

```json payload
{
  "visit": {
    "type": "visit",
    "visit_id": "V-2025-120973",
    "visit_type": "office",
    "reason": "Diabetes follow-up"
  },
  "dx_1": {
    "type": "billing_dx",
    "visit_id": "V-2025-120973",
    "rank": 1,
    "icd10cm": "I10",
    "display": "Essential (primary) hypertension"
  },
  "dx_2": {
    "type": "billing_dx",
    "visit_id": "V-2025-120973",
    "rank": 2,
    "icd10cm": "E11.9",
    "display": "Type 2 diabetes mellitus without complications"
  },
  "dx_3": {
    "type": "billing_dx",
    "visit_id": "V-2025-120973",
    "rank": 3,
    "icd10cm": "E78.5",
    "display": "Hyperlipidemia, unspecified"
  }
}
```
